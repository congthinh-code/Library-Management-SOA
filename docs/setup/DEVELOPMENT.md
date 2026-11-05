# 5. Hướng dẫn thiết lập môi trường phát triển

## 5.1. Công cụ cần cài

- Git.
- Node.js LTS phù hợp với phiên bản Angular/NestJS của dự án.
- npm.
- Docker Desktop.
- Visual Studio Code hoặc IDE tương đương.
- SQL Server Management Studio (SSMS) hoặc công cụ SQL Server tương đương.

TODO: nhóm ghi phiên bản chính xác sau khi thống nhất.

| Công cụ | Phiên bản |
|---|---|
| Node.js | TODO |
| npm | TODO |
| NestJS | TODO |
| Angular CLI | TODO |
| Docker Desktop | TODO |
| SQL Server image | SQL Server 2022 đề xuất |

## 5.2. Clone từ GitHub

```powershell
git clone <GITHUB_REPOSITORY_URL>
cd library-management-soa
git checkout develop
git pull origin develop
```

Thay `<GITHUB_REPOSITORY_URL>` bằng URL repository thực tế. Nếu nhóm chưa tạo nhánh `develop`, làm việc theo nhánh đã thống nhất.

## 5.3. Khởi động SQL Server bằng Docker Compose

File dự kiến: `database/docker/docker-compose.yml`.

```yaml
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: library-sqlserver
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "${DB_PASSWORD}"
    ports:
      - "1433:1433"
    volumes:
      - library_sql_data:/var/opt/mssql
    restart: unless-stopped

volumes:
  library_sql_data:
```

Tạo file `database/docker/.env`:

```env
DB_PASSWORD=ReplaceWithAStrongLocalPassword123!
```

Không commit `.env`. Chạy:

```powershell
cd database/docker
docker compose up -d
docker compose ps
docker compose logs -f sqlserver
```

Kết nối SSMS bằng `localhost,1433`, SQL Server Authentication, login `sa` và mật khẩu local đã cấu hình.

Chỉ dùng cấu hình này cho local development; không dùng mật khẩu mẫu cho môi trường production.

## 5.4. Tạo database và schema

```sql
CREATE DATABASE LibraryDB;
GO

USE LibraryDB;
GO

CREATE SCHEMA auth;
GO
CREATE SCHEMA catalog;
GO
CREATE SCHEMA reader;
GO
CREATE SCHEMA circulation;
GO
CREATE SCHEMA reporting;
GO
```

Chỉ chạy lệnh tạo database/schema khi chúng chưa tồn tại. Có thể đưa các bước này vào script khởi tạo có kiểm tra tồn tại.

## 5.5. Cấu hình biến môi trường

Mỗi service cần có `.env.example` được commit và `.env` riêng trên máy lập trình viên.

Ví dụ Catalog Service:

```env
PORT=3002
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_local_password
DB_DATABASE=LibraryDB
DB_SCHEMA=catalog
```

Tạo `.env` từ `.env.example`, sau đó điền giá trị local. Không gửi secrets qua GitHub.

## 5.6. Cài dependencies

Mỗi NestJS app và Angular app là project độc lập. Chạy `npm ci` trong từng thư mục có `package-lock.json`.

```powershell
cd backend/catalog-service
npm ci
```

Lặp lại cho các service cần chạy. Frontend:

```powershell
cd frontend/library-web
npm ci
```

Nếu chưa có lockfile, người tạo project chạy `npm install` và commit `package-lock.json` trước khi các thành viên dùng `npm ci`.

## 5.7. TypeORM và migrations

- Mỗi service cấu hình TypeORM theo schema sở hữu.
- Đặt `synchronize: false`.
- Mỗi service quản lý migration riêng.
- Chạy migration theo scripts được khai báo trong `package.json` của service.

Ví dụ:

```powershell
npm run migration:run
```

Không bật `synchronize: true` để xử lý khác biệt schema trên máy cá nhân. Khi migration thất bại, kiểm tra biến môi trường, schema, quyền database và lịch sử migration.

## 5.8. Chạy backend

Mở terminal riêng cho từng project:

```powershell
cd backend/api-gateway
npm run start:dev
```

Lặp lại cho Auth, Catalog, Reader, Circulation và Reporting. Kiểm tra port không bị ứng dụng khác chiếm.

## 5.9. Chạy frontend

```powershell
cd frontend/library-web
npm start
```

Mở `http://localhost:4200`. Frontend gọi Gateway tại `http://localhost:3000/api/v1` theo cấu hình environment/proxy của dự án.

## 5.10. Kiểm tra

- SQL Server container đang chạy.
- Database và schema đã được tạo.
- Migrations chạy thành công.
- Các service khởi động được.
- Health endpoint hoạt động.
- Angular mở được và gọi được Gateway.
- Không có `.env`, password hoặc token trong Git status/diff.

## 5.11. Lỗi thường gặp

| Vấn đề | Hướng kiểm tra |
|---|---|
| Không kết nối SQL Server | Docker container, port 1433, password, logs |
| Port đã được sử dụng | Đổi port hoặc dừng tiến trình chiếm port |
| `npm ci` lỗi | Phiên bản Node/npm, lockfile, network |
| Migration lỗi | Schema, quyền DB, env, migration history |
| CORS | Cấu hình CORS tại Gateway |
| API 404 | Prefix, route gateway và contract |
| Máy thành viên chạy khác | Phiên bản Node, lockfile, `.env.example`, migrations |

## 5.12. Checklist máy mới

1. Clone repository từ GitHub.
2. Cài dependencies trong từng project.
3. Tạo `.env` từ `.env.example`.
4. Khởi động SQL Server.
5. Tạo database/schema.
6. Chạy migrations.
7. Khởi động các backend service.
8. Khởi động Angular.
9. Kiểm tra các luồng nghiệp vụ chính.
