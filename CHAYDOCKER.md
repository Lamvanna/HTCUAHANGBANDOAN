# Bước 1: Di chuyển vào thư mục Docker
cd CONGNGHEPHANMEM

# Bước 2: Dọn dẹp containers cũ (nếu có)
docker-compose down --remove-orphans

# Bước 3: Pull images mới nhất
docker-compose pull

# Bước 4: Build và khởi động services
docker-compose up -d --build

# Bước 5: Kiểm tra trạng thái
docker-compose ps
docker-compose logs -f