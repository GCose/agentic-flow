import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { Upload, X, File, Image as ImageIcon, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { FileWithPreview, UploadedFile } from "@/types/upload";

interface FileUploadProps {
  title: string;
  description?: string;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSize?: number;
  onUploadComplete?: (files: UploadedFile[]) => void;
}

const FileUpload = ({
  title,
  description = "Drag and drop files here or click to browse",
  acceptedFileTypes = ["image/*", "video/*", "application/pdf"],
  maxFiles = 5,
  maxSize = 10485760, // 10MB
  onUploadComplete,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create preview URLs for the files
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    ) as FileWithPreview[];

    setFiles((prev) => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize,
  });

  const removeFile = (file: FileWithPreview) => {
    setFiles(files.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-6 w-6" />;
    if (mimeType.startsWith("video/")) return <Video className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    const uploadResults: UploadedFile[] = [];

    // Process each file
    for (const file of files) {
      const fileId = uuidv4();
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress((prev) => ({ ...prev, [fileId]: i }));
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Simulate successful upload
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.preview, // In a real app, this would be the server URL
        uploadedAt: new Date(),
      };

      uploadResults.push(uploadedFile);
    }

    setUploadedFiles((prev) => [...prev, ...uploadResults]);
    setFiles([]);
    setIsUploading(false);

    if (onUploadComplete) {
      onUploadComplete(uploadResults);
    }
  };

  useEffect(() => {
    // Clean up preview URLs when component unmounts
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Card className="border bg-transparent backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxSize)} each
            </p>
            <Button type="button" variant="outline" size="sm">
              Select Files
            </Button>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Files to upload</h3>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={simulateUpload}
                disabled={isUploading}
              >
                Upload {files.length} files
              </Button>
            </div>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.name + file.size}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(uploadProgress).length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Upload Progress</h3>
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{fileId}</span>
                    <span className="text-xs">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between border rounded-md p-3 bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} •{" "}
                        {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Uploaded</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
