# 4. API Contract

## 4.1. Quy ước chung

- Gateway local: `http://localhost:3000`.
- API prefix: `/api/v1`.
- Content type: `application/json`.
- Endpoint riêng tư dùng `Authorization: Bearer <access_token>` nếu triển khai JWT.
- JSON field dùng camelCase.
- Các endpoint dưới đây là contract đề xuất; request/response chi tiết cần được nhóm thống nhất trước khi code.

## 4.2. Response đề xuất

Thành công:

```json
{
  "data": {
    "id": 1
  },
  "message": "Success"
}
```

Danh sách phân trang:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

Lỗi:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "requestId": "example-request-id"
}
```

## 4.3. Auth Service

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất/thu hồi phiên nếu có |
| GET | `/auth/me` | Thông tin tài khoản hiện tại |
| GET | `/auth/users` | Danh sách tài khoản |
| POST | `/auth/users` | Tạo tài khoản |
| PATCH | `/auth/users/:id` | Cập nhật/khóa tài khoản |
| GET | `/auth/roles` | Danh sách vai trò |
| POST | `/auth/users/:id/roles` | Gán vai trò |
| GET | `/auth/settings` | Xem cấu hình được phép |
| PATCH | `/auth/settings/:key` | Cập nhật cấu hình |
| GET | `/auth/audit-logs` | Tra cứu log theo quyền |

## 4.4. Catalog Service

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/books` | Tìm kiếm/danh sách đầu sách |
| GET | `/books/:id` | Chi tiết đầu sách |
| POST | `/books` | Tạo đầu sách |
| PATCH | `/books/:id` | Cập nhật đầu sách |
| DELETE | `/books/:id` | Ngừng sử dụng/xóa mềm nếu phù hợp |
| GET | `/categories` | Danh sách thể loại |
| POST | `/categories` | Tạo thể loại |
| GET | `/authors` | Danh sách tác giả |
| POST | `/authors` | Tạo tác giả |
| GET | `/books/:id/copies` | Danh sách bản sao |
| POST | `/books/:id/copies` | Thêm bản sao |
| GET | `/copies/:id` | Chi tiết bản sao |
| PATCH | `/copies/:id/status` | Cập nhật trạng thái theo quyền/nghiệp vụ |
| POST | `/inventory-sessions` | Tạo đợt kiểm kê |
| GET | `/inventory-sessions` | Danh sách đợt kiểm kê |
| GET | `/inventory-sessions/:id` | Chi tiết đợt kiểm kê |
| POST | `/inventory-sessions/:id/details` | Ghi nhận kết quả kiểm kê |
| POST | `/inventory-sessions/:id/complete` | Hoàn tất đợt kiểm kê |

## 4.5. Reader Service

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/readers` | Danh sách độc giả |
| GET | `/readers/:id` | Chi tiết độc giả |
| POST | `/readers` | Tạo hồ sơ độc giả |
| PATCH | `/readers/:id` | Cập nhật hồ sơ |
| PATCH | `/readers/:id/card-status` | Cập nhật trạng thái thẻ |
| GET | `/readers/me` | Hồ sơ độc giả hiện tại nếu liên kết tài khoản |

## 4.6. Circulation Service

### Mượn/trả

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/loans` | Danh sách phiếu mượn |
| GET | `/loans/:id` | Chi tiết phiếu mượn |
| POST | `/loans` | Tạo phiếu mượn |
| POST | `/loans/:id/returns` | Ghi nhận trả sách |
| GET | `/loans/my` | Lịch sử mượn của độc giả hiện tại |
| GET | `/loans/overdue` | Danh sách quá hạn |

### Đặt giữ

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/reservations` | Độc giả gửi yêu cầu đặt giữ |
| GET | `/reservations/my` | Độc giả xem yêu cầu của mình |
| GET | `/reservations` | Nhân viên xem danh sách yêu cầu |
| GET | `/reservations/:id` | Chi tiết yêu cầu |
| PATCH | `/reservations/:id/cancel` | Hủy yêu cầu nếu hợp lệ |
| PATCH | `/reservations/:id/approve` | Nhân viên xử lý/duyệt nếu quy trình yêu cầu |

### Gia hạn

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/loans/:id/renewal-requests` | Gửi yêu cầu gia hạn |
| GET | `/renewal-requests/my` | Độc giả xem yêu cầu của mình |
| GET | `/renewal-requests` | Nhân viên xem yêu cầu |
| PATCH | `/renewal-requests/:id/approve` | Chấp thuận gia hạn |
| PATCH | `/renewal-requests/:id/reject` | Từ chối gia hạn |

### Vi phạm và tiền phạt

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/violations` | Danh sách vi phạm |
| POST | `/violations` | Ghi nhận vi phạm |
| GET | `/violations/:id` | Chi tiết vi phạm |
| GET | `/fines` | Danh sách khoản phạt |
| GET | `/fines/:id` | Chi tiết khoản phạt |
| PATCH | `/fines/:id/status` | Cập nhật trạng thái xử lý/thanh toán |

Phiên bản hiện tại chỉ theo dõi khoản phạt và trạng thái; không tích hợp cổng thanh toán.

## 4.7. Reporting Service

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/reports/overview` | Thống kê tổng quan |
| GET | `/reports/books` | Thống kê đầu sách/bản sao |
| GET | `/reports/readers` | Thống kê độc giả |
| GET | `/reports/loans` | Thống kê mượn/trả |
| GET | `/reports/overdue` | Báo cáo quá hạn |
| GET | `/reports/violations` | Báo cáo vi phạm |
| GET | `/reports/fines` | Báo cáo tiền phạt |
| GET | `/reports/inventory` | Báo cáo kết quả kiểm kê |

## 4.8. Gateway routing

Gateway công bố các route tương ứng cho frontend, ví dụ:

- `GET /api/v1/books` → Catalog Service.
- `POST /api/v1/loans` → Circulation Service.
- `POST /api/v1/reservations` → Circulation Service.
- `POST /api/v1/auth/login` → Auth Service.
- `GET /api/v1/reports/overview` → Reporting Service.

Cần thống nhất gateway giữ nguyên path hay rewrite path khi forward.

## 4.9. Query và phân trang

Đề xuất:
- `page`: số trang bắt đầu từ 1.
- `limit`: số phần tử mỗi trang.
- `search`: từ khóa.
- `sortBy`: trường trong allowlist.
- `sortOrder`: `asc` hoặc `desc`.
- Có thể thêm bộ lọc trạng thái và khoảng ngày theo từng endpoint.

## 4.10. Mã HTTP

| Code | Ý nghĩa |
|---:|---|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 204 | Thành công, không có body |
| 400 | Request không hợp lệ |
| 401 | Chưa xác thực |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy |
| 409 | Xung đột trạng thái/dữ liệu |
| 422 | Không thỏa quy tắc nghiệp vụ nếu nhóm sử dụng |
| 500 | Lỗi nội bộ |

## 4.11. Quy trình thay đổi API

1. Cập nhật tài liệu trước khi code endpoint/field mới.
2. Thông báo service và frontend có liên quan.
3. Thống nhất request, response, validation, quyền và status code.
4. Cập nhật implementation và test.
5. Không thay đổi contract âm thầm hoặc phá vỡ tương thích.
