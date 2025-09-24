"use client";

import { useFileUrl } from "@/hooks/use-file-upload";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PDFPreviewProps {
  storageId: Id<"_storage">;
  fileName: string;
  className?: string;
}

export function PDFPreview({ storageId, fileName, className = "" }: PDFPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const fileUrl = useFileUrl(storageId);

  if (!fileUrl) {
    return (
      <div className={`aspect-square rounded bg-muted flex items-center justify-center ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`aspect-square rounded bg-muted overflow-hidden ${className}`}>
      {showPreview ? (
        <div className="w-full h-full relative">
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0"
            title={`Preview of ${fileName}`}
            onError={() => setShowPreview(false)}
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={() => setShowPreview(false)}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-2 p-2">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreview(true)}
            className="text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview PDF
          </Button>
        </div>
      )}
    </div>
  );
}
