import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  File,
  Loader2
} from "lucide-react";

export function FileUpload({ 
  value, 
  onChange, 
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  placeholder = "Chọn hình ảnh...",
  showPreview = true,
  allowUrl = true
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      toast({
        title: "Lỗi",
        description: "Định dạng file không được hỗ trợ",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: "Lỗi",
        description: `File quá lớn. Kích thước tối đa: ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      onChange(result.url);
      
      toast({
        title: "Thành công",
        description: "Upload hình ảnh thành công",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể upload hình ảnh",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUrlChange = (url) => {
    onChange(url);
  };

  const clearFile = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      {allowUrl && (
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={uploadMode === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("file")}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload File
          </Button>
          <Button
            type="button"
            variant={uploadMode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setUploadMode("url")}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            URL
          </Button>
        </div>
      )}

      {uploadMode === "file" ? (
        <>
          {/* File Upload Area */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-gray-600">Đang upload...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Click để chọn file hoặc kéo thả</p>
                  <p className="text-xs text-gray-500">
                    {accept} - Tối đa {(maxSize / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* URL Input */}
          <div>
            <Label>URL hình ảnh</Label>
            <Input
              type="url"
              value={value || ""}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </>
      )}

      {/* Preview */}
      {showPreview && value && (
        <div className="relative">
          <Label>Xem trước</Label>
          <div className="relative mt-2 border rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
