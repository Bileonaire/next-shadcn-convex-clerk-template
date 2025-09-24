import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { getFileTypeCategory } from "@/utils/file-utils";

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  onProgress?: (progress: number) => void;
  onSuccess?: (storageId: Id<"_storage">, file: File) => void;
  onError?: (error: Error) => void;
}

export interface FileUploadResult {
  storageId: Id<"_storage"> | null;
  error: string | null;
  isUploading: boolean;
  progress: number;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFileMetadata = useMutation(api.files.saveFileMetadata);
  const deleteFile = useMutation(api.files.deleteFile);

  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [], // No restrictions by default
    onProgress,
    onSuccess,
    onError,
  } = options;

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
      }

      // Check file type if restrictions are set
      if (allowedTypes.length > 0) {
        const isAllowed = allowedTypes.some((allowedType) => {
          if (allowedType.endsWith("/*")) {
            // Handle wildcard patterns like "image/*", "video/*", etc.
            const baseType = allowedType.slice(0, -2);
            return file.type.startsWith(baseType + "/");
          }
          // Handle exact matches
          return file.type === allowedType;
        });

        if (!isAllowed) {
          return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`;
        }
      }

      return null;
    },
    [maxSize, allowedTypes]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult> => {
      try {
        setError(null);
        setProgress(0);
        setIsUploading(true);

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          const error = new Error(validationError);
          setError(validationError);
          onError?.(error);
          return {
            storageId: null,
            error: validationError,
            isUploading: false,
            progress: 0,
          };
        }

        // Generate upload URL
        const uploadUrl = await generateUploadUrl();

        // Create XMLHttpRequest for progress tracking
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progressPercent = Math.round(
                (event.loaded / event.total) * 100
              );
              setProgress(progressPercent);
              onProgress?.(progressPercent);
            }
          });

          xhr.addEventListener("load", async () => {
            try {
              if (xhr.status === 200) {
                const { storageId } = JSON.parse(xhr.responseText);
                const result: FileUploadResult = {
                  storageId: storageId as Id<"_storage">,
                  error: null,
                  isUploading: false,
                  progress: 100,
                };

                setProgress(100);

                // Save file metadata to database
                try {
                  await saveFileMetadata({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    storageId: storageId as Id<"_storage">,
                    category: getFileTypeCategory(file.type),
                  });
                } catch (metadataError) {
                  console.error("Failed to save file metadata:", metadataError);
                  // Don't fail the upload if metadata saving fails
                }

                onSuccess?.(storageId as Id<"_storage">, file);
                toast.success(`${file.name} uploaded successfully!`);
                resolve(result);
              } else {
                throw new Error(`Upload failed with status ${xhr.status}`);
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Upload failed";
              setError(errorMessage);
              onError?.(
                error instanceof Error ? error : new Error(errorMessage)
              );
              resolve({
                storageId: null,
                error: errorMessage,
                isUploading: false,
                progress: 0,
              });
            } finally {
              setIsUploading(false);
            }
          });

          xhr.addEventListener("error", () => {
            const errorMessage = "Network error during upload";
            setError(errorMessage);
            onError?.(new Error(errorMessage));
            resolve({
              storageId: null,
              error: errorMessage,
              isUploading: false,
              progress: 0,
            });
            setIsUploading(false);
          });

          xhr.open("POST", uploadUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setError(errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        setIsUploading(false);
        return {
          storageId: null,
          error: errorMessage,
          isUploading: false,
          progress: 0,
        };
      }
    },
    [generateUploadUrl, validateFile, onProgress, onSuccess, onError]
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[]): Promise<FileUploadResult[]> => {
      const results: FileUploadResult[] = [];

      for (const file of files) {
        const result = await uploadFile(file);
        results.push(result);
      }

      return results;
    },
    [uploadFile]
  );

  const removeFile = useCallback(
    async (storageId: Id<"_storage">) => {
      try {
        await deleteFile({ storageId });
        toast.success("File deleted successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete file";
        toast.error(errorMessage);
        throw error;
      }
    },
    [deleteFile]
  );

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    setIsUploading(false);
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    removeFile,
    reset,
    isUploading,
    progress,
    error,
  };
}

// Hook to get file URL from storage ID
export function useFileUrl(storageId: Id<"_storage"> | undefined) {
  return useQuery(api.files.getFileUrl, storageId ? { storageId } : "skip");
}

// Hook to get multiple file URLs
export function useFileUrls(storageIds: Id<"_storage">[]) {
  return useQuery(
    api.files.getFileUrls,
    storageIds.length > 0 ? { storageIds } : "skip"
  );
}
