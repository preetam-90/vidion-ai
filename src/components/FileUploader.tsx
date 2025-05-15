import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
}

export const FileUploader = ({
  onFilesSelected,
  disabled = false,
  acceptedFileTypes = "image/*,application/pdf,text/plain",
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5
}: FileUploaderProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Validate file size
      const validFiles = filesArray.filter(file => file.size <= maxFileSize);
      
      // Check if any files were rejected due to size
      if (validFiles.length < filesArray.length) {
        console.warn(`${filesArray.length - validFiles.length} files exceeded the max size of ${maxFileSize / (1024 * 1024)}MB`);
      }
      
      // Limit number of files
      const filesToUpload = validFiles.slice(0, maxFiles);
      
      onFilesSelected(filesToUpload);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = () => {
    setDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      
      // Apply the same validation as for the file input
      const validFiles = filesArray.filter(file => file.size <= maxFileSize);
      const filesToUpload = validFiles.slice(0, maxFiles);
      
      onFilesSelected(filesToUpload);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all",
        dragOver ? "border-indigo-500 bg-indigo-50/5" : "border-gray-700 hover:border-gray-500",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        disabled={disabled}
        accept={acceptedFileTypes}
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center justify-center gap-3">
        <UploadCloud className="w-10 h-10 text-gray-400" />
        <div className="text-center">
          <p className="text-sm text-gray-300">
            Drag and drop files, or{" "}
            <Button
              type="button"
              variant="link"
              className="text-indigo-400 p-0 h-auto font-medium"
              disabled={disabled}
              onClick={handleButtonClick}
            >
              browse
            </Button>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Maximum {maxFiles} files, up to {maxFileSize / (1024 * 1024)}MB each
          </p>
        </div>
      </div>
    </div>
  );
}; 