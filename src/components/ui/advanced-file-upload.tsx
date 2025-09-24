"use client";

import React, { useCallback, useState, useRef, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  Eye,
  Trash2,
  FolderOpen,
  CloudUpload,
} from "lucide-react";
import {
  useFileUpload,
  FileUploadOptions,
  useFileUrl,
} from "@/hooks/use-file-upload";
import { useUserFiles } from "@/hooks/use-user-files";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { PDFPreview } from "./pdf-preview";

export interface AdvancedFileUploadProps {
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
  showPreview?: boolean;
  showFileList?: boolean;
  enableDragDrop?: boolean;
  enableProgress?: boolean;
  enableFileActions?: boolean;
  uploadText?: string;
  dropText?: string;
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
  preview?: string;
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

const getFileTypeCategory = (fileType: string): string => {
  if (fileType.startsWith("image/")) return "Images";
  if (fileType.startsWith("video/")) return "Videos";
  if (fileType.startsWith("audio/")) return "Audio";
  if (
    fileType.includes("pdf") ||
    fileType.includes("document") ||
    fileType.includes("text")
  )
    return "Documents";
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("7z")
  )
    return "Archives";
  return "Other";
};

export function AdvancedFileUpload({
  onFileUpload,
  onFilesUpload,
  onFileRemove,
  multiple = true,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  allowedTypes = [],
  disabled = false,
  className,
  showPreview = true,
  showFileList = true,
  enableDragDrop = true,
  enableProgress = true,
  enableFileActions = true,
  uploadText = "Upload Files",
  dropText = "Drag and drop files here, or click to select",
  acceptedFileTypes,
}: AdvancedFileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get persistent files from database
  const userFiles = useUserFiles();
  const deleteFile = useMutation(api.files.deleteFile);

  const uploadOptions: FileUploadOptions = {
    maxSize,
    allowedTypes,
    onProgress: (progress) => {
      setUploadingFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading" ? { ...file, progress } : file
        )
      );
    },
    onSuccess: (storageId, file) => {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? { ...f, storageId, status: "completed" as const, progress: 100 }
            : f
        )
      );
      onFileUpload?.(storageId, file);
    },
    onError: (error) => {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error" as const, error: error.message }
            : f
        )
      );
    },
  };

  const {
    uploadFile,
    uploadMultipleFiles,
    removeFile,
    isUploading,
    progress,
    error,
  } = useFileUpload(uploadOptions);

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

      // Create initial file entries with previews
      const initialFiles: UploadedFile[] = fileArray.map((file) => {
        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          storageId: "" as Id<"_storage">,
          progress: 0,
          status: "uploading" as const,
          preview,
        };
      });

      setUploadingFiles((prev) => [...prev, ...initialFiles]);

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
      if (!disabled && enableDragDrop) {
        setIsDragOver(true);
      }
    },
    [disabled, enableDragDrop]
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

      if (disabled || !enableDragDrop) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, enableDragDrop, handleFiles]
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
          await deleteFile({ storageId });
          onFileRemove?.(storageId);
        } catch (error) {
          console.error("Error removing file:", error);
        }
      }

      setUploadingFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === fileId);
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        return prev.filter((f) => f.id !== fileId);
      });
    },
    [deleteFile, onFileRemove]
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

  const uploadingFilesList = uploadingFiles.filter(
    (f) => f.status === "uploading"
  );
  const errorFiles = uploadingFiles.filter((f) => f.status === "error");

  const filesByCategory =
    userFiles?.reduce(
      (acc, file) => {
        const category = file.category || getFileTypeCategory(file.type);
        if (!acc[category]) acc[category] = [];
        acc[category].push(file);
        return acc;
      },
      {} as Record<string, any[]>
    ) || {};

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <CloudUpload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Files ({userFiles?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {/* Upload Area */}
          <Card
            className={cn(
              "border-2 border-dashed transition-colors",
              enableDragDrop && "cursor-pointer",
              isDragOver && !disabled && "border-primary bg-primary/5",
              disabled && "opacity-50 cursor-not-allowed",
              enableDragDrop && "hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={enableDragDrop ? handleClick : undefined}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{dropText}</p>
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
                  onClick={handleClick}
                >
                  {uploadText}
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
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {enableProgress && uploadingFilesList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Uploading Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {uploadingFilesList.map((file) => {
                  const FileIcon = getFileIcon(file.file.type);
                  return (
                    <div key={file.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {file.file.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(file.file.size)}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {file.progress}%
                        </span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Error Files */}
          {errorFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-destructive">
                  Upload Errors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {errorFiles.map((file) => {
                  const FileIcon = getFileIcon(file.file.type);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.file.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-destructive">
                          {file.error}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          {showFileList && userFiles && userFiles.length > 0 ? (
            <div className="space-y-4">
              {Object.entries(filesByCategory).map(([category, files]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      {category} ({files.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {files.map((file) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <div
                            key={file._id}
                            className="border rounded-lg p-3 space-y-2"
                          >
                            {showPreview && file.type.startsWith("image/") ? (
                              <ImagePreview
                                storageId={file.storageId}
                                alt={file.name}
                              />
                            ) : showPreview &&
                              file.type === "application/pdf" ? (
                              <PDFPreview
                                storageId={file.storageId}
                                fileName={file.name}
                              />
                            ) : (
                              <div className="aspect-square rounded bg-muted flex items-center justify-center">
                                <FileIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}

                            <div className="space-y-1">
                              <p
                                className="text-sm font-medium truncate"
                                title={file.name}
                              >
                                {file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>

                            {enableFileActions && (
                              <FileActions
                                file={file}
                                onRemove={() =>
                                  handleRemoveFile(file._id, file.storageId)
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  No files uploaded yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload some files to see them here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ImagePreview component for displaying images with proper URL handling
function ImagePreview({
  storageId,
  alt,
}: {
  storageId: Id<"_storage">;
  alt: string;
}) {
  const imageUrl = useFileUrl(storageId);

  return (
    <div className="aspect-square rounded overflow-hidden bg-muted">
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

// FileActions component for view, download, and delete actions
function FileActions({ file, onRemove }: { file: any; onRemove: () => void }) {
  const fileUrl = useFileUrl(file.storageId);

  const handleView = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = file.name;
      link.click();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleView}
        disabled={!fileUrl}
        title="View file"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDownload}
        disabled={!fileUrl}
        title="Download file"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onRemove} title="Delete file">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
