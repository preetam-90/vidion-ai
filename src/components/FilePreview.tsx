import { X, FileText, Image as ImageIcon, FileArchive, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FilePreview = ({ files, onRemoveFile }: FilePreviewProps) => {
  if (files.length === 0) return null;

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-400" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-400" />;
    } else if (fileType.includes("zip") || fileType.includes("compressed")) {
      return <FileArchive className="h-5 w-5 text-yellow-400" />;
    }
    return <File className="h-5 w-5 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const renderThumbnail = (file: File) => {
    if (file.type.startsWith("image/")) {
      try {
        const url = URL.createObjectURL(file);
        return (
          <div className="relative w-10 h-10 rounded overflow-hidden">
            <img
              src={url}
              alt={file.name}
              className="w-full h-full object-cover"
              onLoad={() => URL.revokeObjectURL(url)}
            />
          </div>
        );
      } catch (e) {
        console.error("Error creating object URL", e);
        return <div className="w-10 h-10 flex items-center justify-center">{getFileIcon(file.type)}</div>;
      }
    }
    return <div className="w-10 h-10 flex items-center justify-center">{getFileIcon(file.type)}</div>;
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-3 py-2 px-3 rounded-md bg-gray-800 border border-gray-700"
        >
          {renderThumbnail(file)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-gray-700 text-gray-400"
            onClick={() => onRemoveFile(index)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      ))}
    </div>
  );
}; 