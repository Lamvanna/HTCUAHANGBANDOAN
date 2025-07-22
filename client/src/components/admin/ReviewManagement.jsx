import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  Eye, 
  Check, 
  X, 
  Search, 
  Filter,
  MessageSquare,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

export default function ReviewManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch reviews based on approval status
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews", selectedTab],
    queryFn: async () => {
      const approved = selectedTab === "approved" ? "true" : selectedTab === "rejected" ? "false" : undefined;
      const response = await fetch(`/api/reviews?approved=${approved || ""}`);
      return response.json();
    },
  });

  // Fetch products for filter
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      return response.json();
    },
  });

  // Approve review mutation
  const approveReviewMutation = useMutation({
    mutationFn: (reviewId) => apiRequest("PUT", `/api/reviews/${reviewId}`, { approved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/reviews"]);
      toast({
        title: "Thành công",
        description: "Đánh giá đã được phê duyệt",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể phê duyệt đánh giá",
        variant: "destructive",
      });
    },
  });

  // Reject review mutation
  const rejectReviewMutation = useMutation({
    mutationFn: (reviewId) => apiRequest("PUT", `/api/reviews/${reviewId}`, { approved: false }),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/reviews"]);
      toast({
        title: "Thành công",
        description: "Đánh giá đã bị từ chối",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể từ chối đánh giá",
        variant: "destructive",
      });
    },
  });

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchTerm ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProduct = selectedProduct === "all" || !selectedProduct || review.productId === parseInt(selectedProduct);

    return matchesSearch && matchesProduct;
  });

  // Calculate statistics
  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.approved === null || r.approved === undefined).length,
    approved: reviews.filter(r => r.approved === true).length,
    rejected: reviews.filter(r => r.approved === false).length,
    averageRating: reviews.length > 0 ? 
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (approved) => {
    if (approved === true) {
      return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
    } else if (approved === false) {
      return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Từ chối</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Điểm TB</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm đánh giá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo sản phẩm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sản phẩm</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ duyệt ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Từ chối ({stats.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTab === "pending" && "Đánh giá chờ duyệt"}
                {selectedTab === "approved" && "Đánh giá đã duyệt"}
                {selectedTab === "rejected" && "Đánh giá bị từ chối"}
                {selectedTab === "all" && "Tất cả đánh giá"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không có đánh giá nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      products={products}
                      onApprove={() => approveReviewMutation.mutate(review.id)}
                      onReject={() => rejectReviewMutation.mutate(review.id)}
                      onView={() => setSelectedReview(review)}
                      renderStars={renderStars}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Detail Dialog */}
      {selectedReview && (
        <ReviewDetailDialog
          review={selectedReview}
          products={products}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          renderStars={renderStars}
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

// Review Card Component
function ReviewCard({ review, products, onApprove, onReject, onView, renderStars, getStatusBadge }) {
  const product = products.find(p => p.id === review.productId);
  
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{review.userName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.userName || 'Người dùng'}</p>
              <p className="text-sm text-gray-500">{product?.name || 'Sản phẩm không tồn tại'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            {renderStars(review.rating)}
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          
          <p className="text-gray-700 mb-3">{review.comment}</p>
          
          <div className="flex items-center space-x-2">
            {getStatusBadge(review.approved)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {(review.approved === null || review.approved === undefined) && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onApprove}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onReject}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Review Detail Dialog Component
function ReviewDetailDialog({ review, products, isOpen, onClose, renderStars, getStatusBadge }) {
  const product = products.find(p => p.id === review.productId);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{review.userName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-lg">{review.userName || 'Người dùng'}</p>
              <p className="text-gray-500">{review.userEmail || 'Email không có'}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Sản phẩm</h4>
            <p className="text-gray-700">{product?.name || 'Sản phẩm không tồn tại'}</p>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Đánh giá</h4>
            <div className="flex items-center space-x-2 mb-2">
              {renderStars(review.rating)}
              <span className="font-medium">{review.rating}/5</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Bình luận</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Trạng thái</h4>
            {getStatusBadge(review.approved)}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Thời gian</h4>
            <p className="text-gray-500">
              Tạo: {new Date(review.createdAt).toLocaleString('vi-VN')}
            </p>
            {review.updatedAt && review.updatedAt !== review.createdAt && (
              <p className="text-gray-500">
                Cập nhật: {new Date(review.updatedAt).toLocaleString('vi-VN')}
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
