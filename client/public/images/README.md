# Logo Setup Guide

## Cách thêm logo cho Na Food

### 1. Chuẩn bị file logo
- Tên file: `LOGO.png` (chữ hoa)
- Kích thước khuyến nghị: 512x512px hoặc 1024x1024px
- Định dạng: PNG với nền trong suốt
- Chất lượng: High resolution để hiển thị sắc nét

### 2. Đặt file logo
- Copy file logo vào thư mục: `client/public/images/`
- Đảm bảo tên file chính xác: `LOGO.png`

### 3. Logo sẽ hiển thị ở:
- Header của website
- Admin panel sidebar
- Trang đăng nhập/đăng ký
- Các component khác sử dụng Logo component

### 4. Fallback
Nếu file logo không tồn tại, hệ thống sẽ tự động hiển thị icon SVG mặc định.

### 5. Lưu ý
- Logo sẽ được hiển thị trong khung tròn
- Hệ thống tự động resize theo kích thước cần thiết
- Font chữ "Na Food" đã được thay đổi thành Lobster
