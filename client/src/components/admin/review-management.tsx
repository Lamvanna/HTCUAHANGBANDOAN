import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Review } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Star, Eye, Check, X, Trash2 } from "lucide-react";

export default function ReviewManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvedFilter, setApprovedFilter] = useState("");
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", approvedFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (approvedFilter) params.append('approved', approvedFilter);
      
      const response = await fetch(`/api/reviews?${params}`);
      return response.json();
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('PUT', `/api/reviews/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Cập nhật đánh giá thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('DELETE', `/api/reviews/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Xóa đánh giá thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const handleApprove = (reviewId: number) => {
    updateReviewMutation.mutate({ id: reviewId, data: { isApproved: true } });
  };

  const handleReject = (reviewId: number) => {
    updateReviewMutation.mutate({ id: reviewId, data: { isApproved: false } });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchQuery || 
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesApproved = approvedFilter === "all" || !approvedFilter || 
      review.isApproved.toString() === approvedFilter;
    
    return matchesSearch && matchesApproved;
  });

  // Mock additional data for reviews since we don't have full user/product data
  const enrichedReviews = filteredReviews.map(review => ({
    ...review,
    userName: `User ${review.userId}`,
    productName: `Product ${review.productId}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h2>
        <p className="text-gray-600 mt-1">Duyệt và quản lý đánh giá từ khách hàng</p>
      </div>

      {/* Review Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đánh giá</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Thông tin khách hàng</h4>
                  <p className="text-sm text-gray-600">{selectedReview.userName}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sản phẩm</h4>
                  <p className="text-sm text-gray-600">{selectedReview.productName}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Đánh giá</h4>
                <div className="flex items-center space-x-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm text-gray-600">({selectedReview.rating}/5)</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Bình luận</h4>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                  {selectedReview.comment || "Không có bình luận"}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Trạng thái</h4>
                <Badge variant={selectedReview.isApproved ? "default" : "secondary"}>
                  {selectedReview.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                </Badge>
              </div>
              
              <div className="flex justify-end space-x-2">
                {!selectedReview.isApproved && (
                  <Button
                    onClick={() => handleApprove(selectedReview.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Duyệt
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedReview.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteReviewMutation.mutate(selectedReview.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm đánh giá..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={approvedFilter} onValueChange={setApprovedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đã duyệt</SelectItem>
                <SelectItem value="false">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchQuery(''); 
                setApprovedFilter('all'); 
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          ) : enrichedReviews.length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có đánh giá nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {enrichedReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <p className="text-sm text-gray-600">{review.productName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        </div>
                        <Badge variant={review.isApproved ? "default" : "secondary"}>
                          {review.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                        </Badge>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-3 line-clamp-2">{review.comment}</p>
                      )}
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Đăng: {new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!review.isApproved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReviewMutation.mutate(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.isApproved).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => !r.isApproved).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <X className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
