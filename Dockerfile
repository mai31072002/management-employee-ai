# Stage 1: Build React app
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và yarn.lock
# Tối ưu Docker layer: cache dependencies nếu không thay đổi
COPY package.json yarn.lock ./

# Cài đặt dependencies (cả production và dev cho build)
# yarn install --frozen-lockfile đảm bảo version chính xác
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Build React application
# Tạo build files tối ưu cho production
RUN yarn build

# Stage 2: Production server với Nginx
# Dùng image nginx Alpine cho kích thước nhỏ
FROM nginx:alpine

# Cài đặt curl cho health check
RUN apk add --no-cache curl

# Copy build files từ stage builder vào nginx
# Serve static files qua nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy cấu hình nginx tùy chỉnh
# Cấu hình routing cho React và proxy API
COPY nginx.conf /etc/nginx/nginx.conf

# Tạo user không phải root để tăng security
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -s /bin/sh -D appuser

# Thay đổi quyền sở hữu thành user không root
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# Tạo nginx PID file directory
RUN touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Chuyển sang user không root
USER appuser

# Health check để monitor container
# Kiểm tra nginx mỗi 30s
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Mở port 80 cho HTTP
EXPOSE 80

# Khởi động nginx server
CMD ["nginx", "-g", "daemon off;"]
