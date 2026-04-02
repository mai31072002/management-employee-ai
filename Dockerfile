# Stage 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app

# Copy file cấu hình package để install trước (tối ưu cache)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy toàn bộ code và build
COPY . .
RUN yarn build

# Stage 2: Serve với Nginx
FROM nginx:stable-alpine
# Copy file build từ stage 1 vào thư mục của Nginx
# Lưu ý: Nếu dùng Vite thì là /dist, nếu dùng Create React App thì là /build
COPY --from=build /app/build /usr/share/nginx/html

# Copy thêm file cấu hình Nginx (tùy chọn nhưng nên có để tránh lỗi 404 khi F5 trang)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]