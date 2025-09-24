"use client";

import React, { useCallback, useState, useRef, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  X,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useFileUpload, FileUploadOptions } from "@/hooks/use-file-upload";
import { Id } from "@/convex/_generated/dataModel";

export interface FileUploadProps {
  onFileUpload?: (storageId: Id<"_storage">, file: File) => void;
  onFilesUpload?: (
    results: Array<{ storageId: Id<"_storage">; file: File }>
  ) => void;
  onFileRemove?: (storageId: Id<"_storage">) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  acceptedFileTypes?: string; // for input accept attribute
}

interface UploadedFile {
  id: string;
  file: File;
  storageId: Id<"_storage">;
  url?: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return Image;
  if (fileType.startsWith("video/")) return Video;
  if (fileType.startsWith("audio/")) return Music;
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("7z")
  )
    return Archive;
  if (
    fileType.includes("pdf") ||
    fileType.includes("document") ||
    fileType.includes("text")
  )
    return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileUpload({
  onFileUpload,
  onFilesUpload,
  onFileRemove,
  multiple = false,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = [],
  disabled = false,
  className,
  placeholder = "Drag and drop files here, or click to select",
  acceptedFileTypes,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadOptions: FileUploadOptions = {
    maxSize,
    allowedTypes,
    onProgress: (progress) => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading" ? { ...file, progress } : file
        )
      );
    },
    onSuccess: (storageId, file) => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, storageId, status: "completed" as const, progress: 100 }
            : f
        )
      );
      onFileUpload?.(storageId, file);
    },
    onError: (error) => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error" as const, error: error.message }
            : f
        )
      );
    },
  };

  const { uploadFile, uploadMultipleFiles, removeFile, progress, error } =
    useFileUpload(uploadOptions);

  const handleFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);

      if (fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      if (!multiple && fileArray.length > 1) {
        alert("Only one file allowed");
        return;
      }

      // Create initial file entries
      const initialFiles: UploadedFile[] = fileArray.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        storageId: "" as Id<"_storage">,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadedFiles((prev) => [...prev, ...initialFiles]);

      try {
        if (multiple) {
          const results = await uploadMultipleFiles(fileArray);
          const successfulUploads = results
            .filter((result) => result.storageId)
            .map((result, index) => ({
              storageId: result.storageId!,
              file: fileArray[index],
            }));

          if (successfulUploads.length > 0) {
            onFilesUpload?.(successfulUploads);
          }
        } else {
          const result = await uploadFile(fileArray[0]);
          if (result.storageId) {
            onFileUpload?.(result.storageId, fileArray[0]);
          }
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [
      uploadFile,
      uploadMultipleFiles,
      multiple,
      maxFiles,
      onFileUpload,
      onFilesUpload,
    ]
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const handleRemoveFile = useCallback(
    async (fileId: string, storageId?: Id<"_storage">) => {
      if (storageId) {
        try {
          await removeFile(storageId);
          onFileRemove?.(storageId);
        } catch (error) {
          console.error("Error removing file:", error);
        }
      }

      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    },
    [removeFile, onFileRemove]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const getAcceptedTypes = () => {
    if (acceptedFileTypes) return acceptedFileTypes;
    if (allowedTypes.length > 0) return allowedTypes.join(",");
    return undefined;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragOver && !disabled && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          "hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{placeholder}</p>
              <p className="text-xs text-muted-foreground">
                {allowedTypes.length > 0 &&
                  `Accepted types: ${allowedTypes.join(", ")}`}
                {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
                {maxFiles > 1 && ` • Max files: ${maxFiles}`}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="mt-2"
            >
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={getAcceptedTypes()}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {/* Error Display */}
      {error && (
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((file) => {
            const FileIcon = getFileIcon(file.file.type);
            return (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.file.size)}</span>
                        <Badge
                          variant={
                            file.status === "completed"
                              ? "default"
                              : file.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {file.status === "uploading" && (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Uploading...
                            </>
                          )}
                          {file.status === "completed" && (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          )}
                          {file.status === "error" && (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {file.status === "completed" && file.storageId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // You can implement download functionality here
                          console.log("Download file:", file.storageId);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveFile(file.id, file.storageId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {file.status === "uploading" && (
                  <div className="mt-2">
                    <Progress value={file.progress} className="h-2" />
                  </div>
                )}

                {/* Error Message */}
                {file.status === "error" && file.error && (
                  <p className="text-xs text-destructive mt-1">{file.error}</p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
