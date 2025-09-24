"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { AdvancedFileUpload } from "@/components/ui/advanced-file-upload";
import { useFileUrl } from "@/hooks/use-file-upload";
import { useUserFiles } from "@/hooks/use-user-files";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatFileSize, getFileTypeDisplayName } from "@/utils/file-utils";
import { Download, Eye, Trash2 } from "lucide-react";
import { PDFPreview } from "@/components/ui/pdf-preview";

type ConvexFile = {
  _id: Id<"files">;
  userId: string;
  name: string;
  size: number;
  type: string;
  storageId: Id<"_storage">;
  uploadedAt: number;
  category?: string;
  description?: string;
};

export default function FileUploadPage() {
  const [selectedFile, setSelectedFile] = useState<ConvexFile | null>(null);
  const deleteFile = useMutation(api.files.deleteFile);

  // Get files from database instead of local state
  const userFiles = useUserFiles();

  const handleFileUpload = (storageId: Id<"_storage">, file: File) => {
    // File metadata is automatically saved by the upload hook
    console.log("File uploaded:", file.name, storageId);
  };

  const handleFilesUpload = (
    results: Array<{ storageId: Id<"_storage">; file: File }>
  ) => {
    // File metadata is automatically saved by the upload hook
    console.log("Files uploaded:", results);
  };

  const handleFileRemove = async (storageId: Id<"_storage">) => {
    try {
      await deleteFile({ storageId });
      if (selectedFile?.storageId === storageId) {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">File Upload Demo</h1>
        <p className="text-muted-foreground">
          Test the robust file upload functionality with Convex and shadcn/ui
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Upload</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Upload</TabsTrigger>
          <TabsTrigger value="files">
            Uploaded Files ({userFiles?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Single File Upload</CardTitle>
                <CardDescription>
                  Upload a single file with basic validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  multiple={false}
                  maxSize={5 * 1024 * 1024} // 5MB
                  allowedTypes={["image/*", "application/pdf"]}
                  placeholder="Upload an image or PDF (max 5MB)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multiple Files Upload</CardTitle>
                <CardDescription>
                  Upload multiple files with drag & drop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFilesUpload={handleFilesUpload}
                  multiple={true}
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024} // 10MB
                  allowedTypes={["image/*", "application/pdf", "text/*"]}
                  placeholder="Upload multiple files (max 10MB each)"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All File Types</CardTitle>
              <CardDescription>
                Upload any type of file without restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFilesUpload={handleFilesUpload}
                multiple={true}
                maxFiles={10}
                maxSize={50 * 1024 * 1024} // 50MB
                placeholder="Upload any type of file (max 50MB each)"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced File Upload</CardTitle>
              <CardDescription>
                Full-featured upload component with preview, progress, and file
                management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedFileUpload
                onFilesUpload={handleFilesUpload}
                multiple={true}
                maxFiles={20}
                maxSize={100 * 1024 * 1024} // 100MB
                allowedTypes={[
                  "image/*",
                  "video/*",
                  "audio/*",
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "text/*",
                  "application/zip",
                  "application/x-rar-compressed",
                ]}
                showPreview={true}
                showFileList={true}
                enableDragDrop={true}
                enableProgress={true}
                enableFileActions={true}
                uploadText="Upload Files"
                dropText="Drag and drop files here, or click to select"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          {userFiles && userFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userFiles.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  onSelect={setSelectedFile}
                  onRemove={handleFileRemove}
                  isSelected={selectedFile?._id === file._id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="text-muted-foreground mb-4">
                  <svg
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No files uploaded yet
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload some files using the upload components above to see
                  them here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* File Details Modal */}
      {selectedFile && (
        <FileDetailsModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

function FileCard({
  file,
  onSelect,
  onRemove,
  isSelected,
}: {
  file: ConvexFile;
  onSelect: (file: ConvexFile) => void;
  onRemove: (storageId: Id<"_storage">) => void;
  isSelected: boolean;
}) {
  const fileUrl = useFileUrl(file.storageId);

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(file)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {getFileTypeDisplayName(file.type)}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(file.storageId);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Size</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploaded</span>
            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Status</span>
            <Badge variant={fileUrl ? "default" : "secondary"}>
              {fileUrl ? "Available" : "Loading..."}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              if (fileUrl) {
                window.open(fileUrl, "_blank");
              }
            }}
            disabled={!fileUrl}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              if (fileUrl) {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = file.name;
                link.click();
              }
            }}
            disabled={!fileUrl}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FileDetailsModal({
  file,
  onClose,
}: {
  file: ConvexFile;
  onClose: () => void;
}) {
  const fileUrl = useFileUrl(file.storageId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="truncate">{file.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span>
              <p className="text-muted-foreground">
                {getFileTypeDisplayName(file.type)}
              </p>
            </div>
            <div>
              <span className="font-medium">Size:</span>
              <p className="text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <div>
              <span className="font-medium">Uploaded:</span>
              <p className="text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="font-medium">Storage ID:</span>
              <p className="text-muted-foreground font-mono text-xs">
                {file.storageId}
              </p>
            </div>
          </div>

          {fileUrl && (
            <div className="space-y-2">
              <span className="font-medium text-sm">Preview:</span>
              <div className="border rounded p-4 bg-muted/50">
                {file.type.startsWith("image/") ? (
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className="max-w-full max-h-64 object-contain mx-auto"
                  />
                ) : file.type === "application/pdf" ? (
                  <PDFPreview
                    storageId={file.storageId}
                    fileName={file.name}
                    className="max-h-64"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Preview not available for this file type</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(fileUrl, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Open in New Tab
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (fileUrl) {
                  window.open(fileUrl, "_blank");
                }
              }}
              disabled={!fileUrl}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View File
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (fileUrl) {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = file.name;
                  link.click();
                }
              }}
              disabled={!fileUrl}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
