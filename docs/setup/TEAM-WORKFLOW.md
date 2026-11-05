# 6. Quy trình làm việc nhóm với GitHub

## 6.1. Repository và nhánh

Dùng GitHub làm nơi lưu trữ mã nguồn và quản lý thay đổi.

Đề xuất các nhánh:

- `main`: phiên bản ổn định để demo/nộp.
- `develop`: nhánh tích hợp.
- `feature/<ten-chuc-nang>`: phát triển chức năng.
- `fix/<mo-ta-ngan>`: sửa lỗi.

Ví dụ:

```text
feature/catalog-books
feature/catalog-inventory
feature/auth-login
feature/reader-management
feature/circulation-loans
feature/circulation-reservations
feature/angular-book-list
```

## 6.2. Quy trình làm việc

1. Cập nhật `develop`.
2. Tạo feature branch từ `develop`.
3. Code và kiểm thử trong phạm vi được giao.
4. Commit thay đổi liên quan.
5. Push branch lên GitHub.
6. Tạo Pull Request (PR) vào `develop`.
7. Thành viên review, góp ý và xử lý conflict.
8. Merge khi kiểm tra cơ bản đạt.

Lệnh mẫu trên PowerShell:

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/catalog-books

# Sau khi thay đổi và kiểm tra
git add .
git commit -m "feat(catalog): add book management"
git push -u origin feature/catalog-books
```

Tạo Pull Request trên GitHub từ feature branch về `develop`.

## 6.3. Quy ước commit

- `feat`: chức năng mới.
- `fix`: sửa lỗi.
- `docs`: tài liệu.
- `refactor`: tái cấu trúc.
- `test`: kiểm thử.
- `chore`: cấu hình/bảo trì.

Ví dụ:

```text
feat(auth): implement login endpoint
feat(catalog): add inventory management
feat(circulation): add reservation request
fix(circulation): prevent duplicate return
docs(api): update loan endpoints
```

## 6.4. Phân công dự kiến

| Vai trò | Phạm vi |
|---|---|
| Nhóm trưởng | Kiến trúc, API Gateway, Circulation, tích hợp |
| Thành viên 2–3 | Angular frontend |
| Thành viên 4 | Auth và Reader |
| Thành viên 5 | Catalog và Reporting |

TODO: cập nhật tên và phân công chi tiết thực tế. Nhóm frontend cần phối hợp sớm với backend để thống nhất API contract.

## 6.5. Phối hợp database

- Mỗi service sở hữu schema và migrations riêng.
- Trao đổi trước khi thay đổi bảng/field được service khác tham chiếu.
- Không để nhiều thành viên cùng sửa một migration chưa thống nhất.
- Không sửa migration đã chạy trên môi trường dùng chung; tạo migration mới.
- Commit migration cùng thay đổi entity.
- Không dùng `synchronize: true` trên môi trường nhóm.
- Seed data phải có hướng dẫn và không chứa dữ liệu cá nhân thật.

## 6.6. Phối hợp API

- Endpoint, JSON field, status code, validation và quyền truy cập phải được ghi trong `docs/api/API-CONTRACT.md`.
- Backend thông báo thay đổi contract trước khi merge.
- Frontend sử dụng contract đã thống nhất, không tự suy đoán response.
- Ưu tiên thay đổi tương thích ngược; breaking change phải được nhóm thống nhất.

## 6.7. Checklist Pull Request

- [ ] Chạy được ứng dụng liên quan.
- [ ] Không có secrets hoặc file `.env`.
- [ ] Có migration nếu thay đổi database.
- [ ] Đã cập nhật API contract nếu thay đổi API.
- [ ] Có test phù hợp.
- [ ] Đã kiểm tra `git diff` và `git status`.
- [ ] Không commit `node_modules`, `dist`, file IDE cá nhân hoặc file build.
- [ ] PR có mô tả thay đổi và cách kiểm thử.

## 6.8. GitHub Issues và Projects

Có thể dùng GitHub Issues để giao việc và theo dõi lỗi. Mỗi issue nên có:
- Mục tiêu công việc.
- Phạm vi và tiêu chí hoàn thành.
- Người phụ trách.
- Nhãn phù hợp (backend, frontend, database, bug, documentation).
- PR liên quan.

GitHub Projects có thể dùng làm bảng Kanban nếu nhóm thấy cần thiết.

## 6.9. Tích hợp định kỳ

Mỗi tuần:
1. Pull nhánh tích hợp trên máy sạch hoặc máy thành viên khác.
2. Cài dependencies bằng `npm ci`.
3. Tạo `.env` theo `.env.example`.
4. Khởi động database và chạy migrations.
5. Chạy backend services và frontend.
6. Kiểm tra các luồng xuyên service.
7. Ghi lại lỗi, người phụ trách và thời hạn xử lý.

## 6.10. Definition of Done

Một chức năng chỉ hoàn thành khi:
- Đáp ứng yêu cầu đã thống nhất.
- Có validation và xử lý lỗi cơ bản.
- Có kiểm thử phù hợp.
- Cập nhật tài liệu/API contract.
- Chạy được theo hướng dẫn chung.
- PR được review và merge vào nhánh tích hợp.
