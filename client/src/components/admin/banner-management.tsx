import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Banner } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Image as ImageIcon, ArrowUp, ArrowDown, Upload } from "lucide-react";

export default function BannerManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    queryFn: async () => {
      const response = await fetch('/api/banners');
      return response.json();
    },
  });

  const createBannerMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('POST', '/api/banners', data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Thêm banner thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('PUT', `/api/banners/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Cập nhật banner thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
      setEditingBanner(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('DELETE', `/api/banners/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Xóa banner thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      order: 0,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      });
      return;
    }

    setIsCompressing(true);
    try {
      const compressedImage = await compressImage(file);
      setImageFile(file);
      setImagePreview(compressedImage);
      setFormData(prev => ({ ...prev, image: compressedImage }));
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xử lý hình ảnh",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBanner) {
      updateBannerMutation.mutate({ id: editingBanner.id, data: formData });
    } else {
      createBannerMutation.mutate(formData);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      order: banner.order,
      isActive: banner.isActive,
    });
    setImagePreview(banner.image);
    setImageFile(null);
  };

  const handleOrderChange = (bannerId: number, newOrder: number) => {
    updateBannerMutation.mutate({ 
      id: bannerId, 
      data: { order: newOrder } 
    });
  };

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý banner</h2>
          <p className="text-gray-600 mt-1">Quản lý banner quảng cáo trên trang chủ</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Thêm banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm banner mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="order">Thứ tự hiển thị</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="image">Hình ảnh</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isCompressing ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        ) : (
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Chọn file</span> hoặc kéo thả vào đây
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                      </div>
                      <input 
                        id="image" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="flex items-center space-x-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-16 w-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          {imageFile?.name || "Hình ảnh hiện tại"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : "Đã tải lên"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="link">Link đích (tùy chọn)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={createBannerMutation.isPending}>
                  {createBannerMutation.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBanner} onOpenChange={() => setEditingBanner(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa banner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Tiêu đề</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-order">Thứ tự hiển thị</Label>
                <Input
                  id="edit-order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-image">Hình ảnh</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="edit-image"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isCompressing ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      ) : (
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Chọn file</span> hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                    </div>
                    <input 
                      id="edit-image" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {imagePreview && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {imageFile?.name || "Hình ảnh hiện tại"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : "Đã tải lên"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                    >
                      Xóa
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-link">Link đích (tùy chọn)</Label>
              <Input
                id="edit-link"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setEditingBanner(null)}>
                Hủy
              </Button>
              <Button type="submit" disabled={updateBannerMutation.isPending}>
                {updateBannerMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Banner List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách banner</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có banner nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBanners.map((banner) => (
                <div key={banner.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-32 h-20 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{banner.title}</h3>
                          {banner.description && (
                            <p className="text-gray-600 mt-1">{banner.description}</p>
                          )}
                          {banner.link && (
                            <a
                              href={banner.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm mt-1 block"
                            >
                              {banner.link}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={banner.isActive ? "default" : "secondary"}>
                            {banner.isActive ? "Hoạt động" : "Tắt"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Thứ tự: {banner.order}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderChange(banner.id, banner.order - 1)}
                          disabled={banner.order === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderChange(banner.id, banner.order + 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBannerMutation.mutate(banner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
