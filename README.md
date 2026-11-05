# Library Management SOA

Hệ thống quản lý thư viện được xây dựng theo định hướng **Service-Oriented Architecture (SOA)**, phục vụ đồ án môn học. Hệ thống hỗ trợ quản lý sách và bản sao, độc giả, mượn/trả, đặt giữ, gia hạn, vi phạm, kiểm kê và báo cáo cơ bản.

> **Trạng thái tài liệu:** Phiên bản khởi tạo theo phạm vi nhóm đã báo cáo giảng viên. Các nội dung có nhãn `TODO` hoặc “cần thống nhất” chưa phải quyết định nghiệp vụ cuối cùng.

## 1. Mục tiêu

- Quản lý tập trung thông tin đầu sách và từng bản sao.
- Hỗ trợ độc giả tra cứu sách và tình trạng sách.
- Quản lý hồ sơ độc giả.
- Hỗ trợ mượn, trả, đặt giữ và gia hạn sách.
- Theo dõi sách quá hạn, vi phạm và tiền phạt.
- Hỗ trợ kiểm kê sách thủ công và thống kê hoạt động thư viện.
- Tổ chức nghiệp vụ thành các service có trách nhiệm rõ ràng, có thể tích hợp qua API.

## 2. Công nghệ dự kiến

| Thành phần | Công nghệ |
|---|---|
| Backend | NestJS |
| Frontend | Angular |
| Database | Microsoft SQL Server |
| ORM | TypeORM |
| Database migrations | TypeORM Migrations |
| Local database environment | Docker Compose |
| API | REST / JSON |
| Authentication dự kiến | JWT Bearer Token |
| Source control | Git và GitHub |

Phiên bản cụ thể của Node.js, NestJS, Angular, SQL Server và dependencies cần được nhóm thống nhất, ghi trong cấu hình dự án.

## 3. Kiến trúc tổng quan

```text
Angular Web App
      |
      | HTTP / JSON
      v
  API Gateway
      |
      +------ Auth Service
      +------ Catalog Service
      +------ Reader Service
      +------ Circulation Service
      +------ Reporting Service
                    |
                    v
              SQL Server
                LibraryDB
```

Frontend gọi API Gateway. Gateway định tuyến request đến service phụ trách nghiệp vụ. Mỗi service sở hữu dữ liệu/schema của mình và không truy cập trực tiếp bảng của service khác.

## 4. Các service

| Service | Trách nhiệm | Port local đề xuất |
|---|---|---:|
| API Gateway | Điểm vào backend, định tuyến, xử lý chung | 3000 |
| Auth Service | Đăng nhập, tài khoản, vai trò, phân quyền, cấu hình và hỗ trợ audit | 3001 |
| Catalog Service | Đầu sách, tác giả, thể loại, bản sao, tình trạng và kiểm kê | 3002 |
| Reader Service | Hồ sơ độc giả, thông tin thẻ và trạng thái độc giả | 3003 |
| Circulation Service | Mượn, trả, đặt giữ, gia hạn, vi phạm và tiền phạt | 3004 |
| Reporting Service | Thống kê sách, độc giả, mượn/trả, quá hạn, vi phạm và tiền phạt | 3005 |
| Angular Web | Giao diện người dùng | 4200 |

Các port trên là cấu hình phát triển đề xuất, có thể điều chỉnh bằng biến môi trường.

## 5. Phạm vi

### Trong phạm vi dự kiến

- Tài khoản, đăng nhập, đăng xuất và phân quyền theo vai trò.
- Quản lý đầu sách, bản sao, tác giả và thể loại.
- Tra cứu sách theo mã, tên, tác giả và thể loại.
- Quản lý độc giả và trạng thái thẻ.
- Lập phiếu mượn, ghi nhận trả sách.
- Đặt giữ sách và gửi/xử lý yêu cầu gia hạn.
- Theo dõi quá hạn, ghi nhận vi phạm và tiền phạt.
- Kiểm kê sách thủ công.
- Thống kê, báo cáo cơ bản.
- Nhật ký hoạt động quan trọng ở mức phù hợp đồ án.

### Ngoài phạm vi phiên bản đồ án

- Tích hợp cổng thanh toán trực tuyến.
- Ứng dụng di động riêng.
- Kết nối và đồng bộ nhiều thư viện.
- Kiểm kê tự động (RFID/barcode tự động hoặc thiết bị chuyên dụng).
- Tích hợp thực tế với hệ thống quản lý sinh viên hoặc thư viện điện tử bên ngoài.

Các hệ thống ngoài được nhắc đến trong bối cảnh là định hướng tích hợp tương lai, không phải cam kết triển khai trong phiên bản hiện tại.

## 6. Cấu trúc repository

```text
library-management-soa/
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── catalog-service/
│   ├── reader-service/
│   ├── circulation-service/
│   └── reporting-service/
├── frontend/
│   └── library-web/
├── database/
│   ├── docker/
│   ├── scripts/
│   └── seed/
├── docs/
│   ├── requirements/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   └── setup/
└── README.md
```

## 7. Tài liệu

- [Mô tả bài toán và yêu cầu](docs/requirements/REQUIREMENTS.md)
- [Kiến trúc SOA](docs/architecture/ARCHITECTURE.md)
- [Thiết kế database](docs/database/DATABASE.md)
- [API Contract](docs/api/API-CONTRACT.md)
- [Hướng dẫn phát triển](docs/setup/DEVELOPMENT.md)
- [Quy trình làm việc nhóm và GitHub](docs/setup/TEAM-WORKFLOW.md)

## 8. Quy ước phát triển

- Dùng GitHub để lưu trữ mã nguồn, quản lý nhánh và Pull Request.
- Mỗi service sở hữu schema và migrations riêng.
- Không tạo foreign key vật lý xuyên service/schema.
- Giao tiếp liên service thông qua API hoặc cơ chế tích hợp đã thống nhất.
- TypeORM `synchronize` phải để `false` trong môi trường làm việc nhóm.
- Commit `package-lock.json`; không commit `node_modules`, file `.env`, mật khẩu hoặc token.
- Mọi thay đổi API/database phải cập nhật tài liệu tương ứng.

## 9. Phân công nhóm dự kiến

| Vai trò | Phạm vi |
|---|---|
| Nhóm trưởng | Kiến trúc, API Gateway, Circulation Service, tích hợp |
| Thành viên 2–3 | Angular frontend |
| Thành viên 4 | Auth Service và Reader Service |
| Thành viên 5 | Catalog Service và Reporting Service |

TODO: cập nhật tên thành viên và phân công chi tiết thực tế.

## 10. Trạng thái dự án

| Hạng mục | Trạng thái |
|---|---|
| Mô tả bài toán và yêu cầu | Đã có nội dung báo cáo; cần đặc tả chi tiết |
| Kiến trúc SOA | Đề xuất |
| Database design | Đề xuất; cần chốt nghiệp vụ |
| API contract | Đề xuất; cần chốt request/response |
| Backend services | TODO |
| Angular frontend | TODO |
| Tích hợp và kiểm thử | TODO |
| Demo/triển khai | TODO |

## 11. Lưu ý

Các quy định như số sách tối đa được mượn, thời hạn mượn, số lần gia hạn, thứ tự ưu tiên đặt giữ và mức phạt cần được nhóm xác nhận theo yêu cầu giảng viên/thư viện. Không tự coi các giá trị minh họa là chính sách chính thức.

## 12. Giấy phép

Dự án phục vụ mục đích học tập. TODO: bổ sung giấy phép nếu được yêu cầu.
