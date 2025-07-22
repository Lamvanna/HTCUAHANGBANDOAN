import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth.jsx";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Star, MessageSquare, ThumbsUp, Flag } from "lucide-react";

export default function ProductReviews({ productId }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews", productId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?productId=${productId}&approved=true`);
      return response.json();
    },
  });

  // Check if user has already reviewed this product
  const { data: userReviews = [] } = useQuery({
    queryKey: ["/api/reviews", productId, "user"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/reviews?productId=${productId}&userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const userReview = userReviews.find(r => r.userId === user?.id);

  // Check if user has delivered orders with this product
  const { data: deliveredOrders = [] } = useQuery({
    queryKey: ["/api/orders/delivered", user?.id],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/orders?status=delivered`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Check if user can review this product
  const canReview = isAuthenticated && !userReview && deliveredOrders.some(order =>
    order.userId === user?.id &&
    order.items &&
    order.items.some(item =>
      item.productId === productId || item.id === productId
    )
  );

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) => {
      console.log('Sending review data:', reviewData);
      return apiRequest("POST", "/api/reviews", reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/reviews", productId]);
      queryClient.invalidateQueries(["/api/reviews", productId, "user"]);
      setIsReviewDialogOpen(false);
      toast({
        title: "Thành công",
        description: "Đánh giá của bạn đã được gửi",
      });
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể gửi đánh giá",
        variant: "destructive",
      });
    },
  });

  const likeReviewMutation = useMutation({
    mutationFn: (reviewId) => apiRequest("POST", `/api/reviews/${reviewId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/reviews", productId]);
    },
  });

  const reportReviewMutation = useMutation({
    mutationFn: (reviewId) => apiRequest("POST", `/api/reviews/${reviewId}/report`),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Báo cáo đã được gửi",
      });
    },
  });

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Đánh giá sản phẩm</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= averageRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {reviews.length} đánh giá
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Status Messages */}
          {isAuthenticated && !userReview && !canReview && (
            <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-2">
                💡 Bạn cần mua và nhận sản phẩm này để có thể đánh giá
              </p>
              <p className="text-sm text-gray-500">
                Chỉ khách hàng đã mua hàng mới có thể đánh giá sản phẩm
              </p>
            </div>
          )}

          {isAuthenticated && userReview && (
            <div className="mt-6 text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 mb-2">
                ✅ Bạn đã đánh giá sản phẩm này
              </p>
              <p className="text-sm text-blue-500">
                Cảm ơn bạn đã chia sẻ trải nghiệm!
              </p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-600 mb-2">
                🔐 Đăng nhập để đánh giá sản phẩm
              </p>
              <p className="text-sm text-yellow-500">
                Bạn cần đăng nhập và mua sản phẩm để có thể đánh giá
              </p>
            </div>
          )}

          {/* Write Review Button */}
          {isAuthenticated && !userReview && canReview && (
            <div className="mt-6 text-center">
              <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Star className="mr-2 h-4 w-4" />
                    Viết đánh giá
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đánh giá sản phẩm</DialogTitle>
                  </DialogHeader>
                  <ReviewForm
                    productId={productId}
                    userId={user?.id}
                    deliveredOrders={deliveredOrders}
                    onSubmit={(data) => createReviewMutation.mutate(data)}
                    isLoading={createReviewMutation.isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {userReview && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">Đánh giá của bạn:</p>
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= userReview.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground">
                  {new Date(userReview.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-sm">{userReview.comment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Chưa có đánh giá nào cho sản phẩm này
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <div className="w-full h-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{review.userName || 'Người dùng'}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      {review.isVerifiedPurchase && (
                        <Badge variant="secondary" className="text-xs">
                          Đã mua hàng
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeReviewMutation.mutate(review.id)}
                        disabled={!isAuthenticated}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Hữu ích ({review.likes || 0})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reportReviewMutation.mutate(review.id)}
                        disabled={!isAuthenticated}
                      >
                        <Flag className="h-4 w-4 mr-1" />
                        Báo cáo
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function ReviewForm({ productId, userId, deliveredOrders = [], onSubmit, isLoading }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  // Filter delivered orders that contain this product and belong to this user
  const eligibleOrders = deliveredOrders.filter(order =>
    order.userId === userId &&
    order.items &&
    order.items.some(item => item.productId === productId || item.id === productId)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim() || !selectedOrderId) {
      console.log('Form validation failed:', { comment: comment.trim(), selectedOrderId });
      return;
    }

    const parsedProductId = parseInt(productId);
    const parsedOrderId = parseInt(selectedOrderId);

    if (isNaN(parsedProductId) || isNaN(parsedOrderId)) {
      console.error('Invalid ID conversion:', { productId, selectedOrderId, parsedProductId, parsedOrderId });
      return;
    }

    const reviewData = {
      productId: parsedProductId,
      orderId: parsedOrderId,
      rating,
      comment: comment.trim(),
    };

    console.log('Submitting review data:', reviewData);
    console.log('Data types:', {
      productId: typeof reviewData.productId,
      orderId: typeof reviewData.orderId,
      rating: typeof reviewData.rating,
      comment: typeof reviewData.comment
    });

    onSubmit(reviewData);
  };

  if (eligibleOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">
          Bạn cần mua và nhận sản phẩm này trước khi có thể đánh giá.
        </p>
        <p className="text-sm text-gray-400">
          Chỉ có thể đánh giá sản phẩm từ đơn hàng đã giao thành công.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Chọn đơn hàng ({eligibleOrders.length} đơn hàng khả dụng)
        </label>
        <select
          value={selectedOrderId}
          onChange={(e) => setSelectedOrderId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        >
          <option value="">Chọn đơn hàng đã giao...</option>
          {eligibleOrders.map((order) => (
            <option key={order.id} value={order.id}>
              Đơn hàng #{order.id} - {new Date(order.createdAt).toLocaleDateString('vi-VN')} - {order.total?.toLocaleString('vi-VN')}đ
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Đánh giá của bạn
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {rating === 1 && "Rất không hài lòng"}
          {rating === 2 && "Không hài lòng"}
          {rating === 3 && "Bình thường"}
          {rating === 4 && "Hài lòng"}
          {rating === 5 && "Rất hài lòng"}
        </p>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Nhận xét
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          rows={4}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading || !comment.trim() || !selectedOrderId}
          className="min-w-[120px]"
        >
          {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>
    </form>
  );
}
