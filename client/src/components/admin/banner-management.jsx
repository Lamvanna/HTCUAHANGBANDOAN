import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function BannerManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["/api/banners"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/banners', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  const createBannerMutation = useMutation({
    mutationFn: (bannerData) => apiRequest("POST", "/api/banners", bannerData),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/banners"]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Banner đã được tạo thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo banner",
        variant: "destructive",
      });
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, ...bannerData }) => apiRequest("PUT", `/api/banners/${id}`, bannerData),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/banners"]);
      setEditingBanner(null);
      toast({
        title: "Thành công",
        description: "Banner đã được cập nhật thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật banner",
        variant: "destructive",
      });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/banners"]);
      toast({
        title: "Thành công",
        description: "Banner đã được xóa thành công",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa banner",
        variant: "destructive",
      });
    },
  });

  const toggleBannerStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => apiRequest("PUT", `/api/banners/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/banners"]);
      toast({
        title: "Thành công",
        description: "Trạng thái banner đã được cập nhật",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật trạng thái banner",
        variant: "destructive",
      });
    },
  });

  const updateBannerOrderMutation = useMutation({
    mutationFn: ({ id, order }) => apiRequest("PUT", `/api/banners/${id}`, { order }),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/banners"]);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thứ tự banner",
        variant: "destructive",
      });
    },
  });

  const handleDeleteBanner = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      deleteBannerMutation.mutate(id);
    }
  };

  const handleToggleStatus = (banner) => {
    toggleBannerStatusMutation.mutate({ id: banner.id, isActive: !banner.isActive });
  };

  const handleMoveUp = (banner) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex > 0) {
      const newOrder = banners[currentIndex - 1].order;
      updateBannerOrderMutation.mutate({ id: banner.id, order: newOrder });
    }
  };

  const handleMoveDown = (banner) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex < banners.length - 1) {
      const newOrder = banners[currentIndex + 1].order;
      updateBannerOrderMutation.mutate({ id: banner.id, order: newOrder });
    }
  };

  // Sort banners by order
  const sortedBanners = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4 admin-form-container">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý Banner</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý banner hiển thị trên trang chủ
          </p>
        </div>
        <div className="dialog-scrollable">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-3 w-3" />
                Thêm Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl admin-modal-content">
              <DialogHeader>
                <DialogTitle>Thêm banner mới</DialogTitle>
              </DialogHeader>
              <BannerForm
                onSubmit={(data) => createBannerMutation.mutate(data)}
                isLoading={createBannerMutation.isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Banner</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{banners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <ToggleRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {banners.filter(b => b.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm dừng</CardTitle>
            <ToggleLeft className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {banners.filter(b => !b.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Banner ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : sortedBanners.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có banner nào</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedBanners.map((banner, index) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <img
                        src={banner.image || "/placeholder-banner.jpg"}
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{banner.title}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {banner.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2 max-w-xs">
                        {banner.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-blue-600">
                        {banner.link || "Không có"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">{banner.order || 0}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => handleMoveUp(banner)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => handleMoveDown(banner)}
                            disabled={index === sortedBanners.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(banner)}
                        disabled={toggleBannerStatusMutation.isLoading}
                      >
                        {banner.isActive ? (
                          <Badge className="bg-green-100 text-green-800">
                            <ToggleRight className="h-3 w-3 mr-1" />
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <ToggleLeft className="h-3 w-3 mr-1" />
                            Tạm dừng
                          </Badge>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <div className="dialog-scrollable">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingBanner(banner)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl admin-modal-content">
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa banner</DialogTitle>
                              </DialogHeader>
                              <BannerForm
                                banner={editingBanner}
                                onSubmit={(data) => updateBannerMutation.mutate({ id: editingBanner.id, ...data })}
                                isLoading={updateBannerMutation.isLoading}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                          disabled={deleteBannerMutation.isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BannerForm({ banner, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    image: banner?.image || '',
    link: banner?.link || '',
    order: banner?.order || 0,
    isActive: banner?.isActive ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      order: Number(formData.order),
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>Hình ảnh banner *</Label>
        <FileUpload
          value={formData.image}
          onChange={(url) => handleChange('image', url)}
          accept="image/*"
          placeholder="Chọn hình ảnh banner..."
          showPreview={true}
          allowUrl={true}
        />
      </div>

      <div>
        <Label htmlFor="link">Link (tùy chọn)</Label>
        <Input
          id="link"
          value={formData.link}
          onChange={(e) => handleChange('link', e.target.value)}
          placeholder="#menu hoặc https://example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="order">Thứ tự hiển thị</Label>
          <Input
            id="order"
            type="number"
            value={formData.order}
            onChange={(e) => handleChange('order', e.target.value)}
            min="0"
          />
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Hiển thị banner</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : (banner ? "Cập nhật" : "Tạo mới")}
        </Button>
      </div>
    </form>
  );
}
