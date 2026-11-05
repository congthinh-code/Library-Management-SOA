# 1. Mô tả bài toán và yêu cầu hệ thống

## 1.1. Bối cảnh bài toán

Thư viện có thể đang quản lý hoạt động bằng phương pháp thủ công hoặc các phần mềm đơn lẻ, khó mở rộng. Điều này có thể gây khó khăn khi tra cứu tài liệu, xử lý mượn/trả, theo dõi tình trạng bản sao và tổng hợp báo cáo. Việc tích hợp với các hệ thống khác như quản lý sinh viên, cổng thanh toán hoặc thư viện điện tử liên kết cũng có thể gặp hạn chế.

Vì vậy, nhóm đề xuất xây dựng hệ thống quản lý thư viện nhằm tập trung hóa dữ liệu, hỗ trợ tự động hóa các nghiệp vụ cơ bản và tạo nền tảng tích hợp thông qua kiến trúc hướng dịch vụ SOA.

Các hệ thống bên ngoài được nêu trong bối cảnh là định hướng có thể tích hợp trong tương lai; không thuộc phạm vi triển khai hiện tại trừ khi giảng viên yêu cầu bổ sung.

## 1.2. Mục tiêu hệ thống

- Quản lý tập trung thông tin đầu sách và từng bản sao.
- Hỗ trợ tra cứu sách nhanh chóng.
- Quản lý thông tin độc giả.
- Quản lý quy trình mượn, trả và gia hạn sách.
- Hỗ trợ đặt giữ sách theo quy định.
- Theo dõi sách quá hạn, tình trạng tài liệu, vi phạm và tiền phạt.
- Hỗ trợ kiểm kê thủ công.
- Thống kê, báo cáo hoạt động thư viện.
- Tổ chức nghiệp vụ thành các dịch vụ có thể tái sử dụng và tích hợp theo SOA.

## 1.3. Đối tượng sử dụng

### Độc giả (sinh viên/giảng viên)

- Tìm kiếm sách theo tên, tác giả, thể loại hoặc mã sách.
- Xem thông tin và tình trạng sách.
- Gửi yêu cầu đặt giữ sách và theo dõi trạng thái.
- Gửi yêu cầu gia hạn thời gian mượn.
- Xem lịch sử mượn – trả cá nhân và sách đang mượn.

### Nhân viên thư viện

- Quản lý đầu sách và từng bản sao.
- Cập nhật thông tin, số lượng và tình trạng sách.
- Quản lý hồ sơ độc giả và trạng thái thẻ.
- Lập phiếu mượn, ghi nhận trả.
- Xử lý yêu cầu đặt giữ và gia hạn.
- Ghi nhận vi phạm và tiền phạt.
- Kiểm kê, theo dõi tình trạng tài liệu.
- Tra cứu thông tin và xem báo cáo phục vụ công việc.

### Quản trị viên

- Quản lý tài khoản người dùng.
- Phân quyền truy cập theo vai trò.
- Cấu hình thông số hệ thống.
- Theo dõi nhật ký hoạt động (log).
- Kiểm tra lịch sử đăng nhập và các thao tác quan trọng.

## 1.4. Phạm vi hệ thống

### Trong phạm vi

- Quản lý sách và bản sao.
- Quản lý độc giả.
- Tra cứu sách.
- Mượn, trả và gia hạn.
- Đặt giữ sách.
- Theo dõi quá hạn, vi phạm và tiền phạt.
- Kiểm kê thủ công.
- Thống kê, báo cáo cơ bản.
- Quản lý tài khoản, phân quyền và nhật ký hoạt động ở mức cơ bản.

### Ngoài phạm vi

- Tích hợp cổng thanh toán trực tuyến.
- Ứng dụng di động riêng.
- Kết nối và đồng bộ nhiều thư viện.
- Kiểm kê tự động bằng thiết bị chuyên dụng.
- Tích hợp thực tế với hệ thống quản lý sinh viên hoặc thư viện điện tử bên ngoài.

## 1.5. Yêu cầu chức năng

| Mã | Nhóm chức năng | Mô tả |
|---|---|---|
| FR-01 | Xác thực | Đăng nhập và đăng xuất |
| FR-02 | Tài khoản | Tạo, cập nhật, khóa tài khoản |
| FR-03 | Phân quyền | Phân quyền theo vai trò độc giả, nhân viên, quản trị viên |
| FR-04 | Cấu hình và audit | Quản lý thông số được phép và theo dõi log quan trọng |
| FR-05 | Quản lý đầu sách | Thêm, cập nhật, ngừng sử dụng đầu sách |
| FR-06 | Quản lý bản sao | Quản lý mã cuốn sách và tình trạng từng bản |
| FR-07 | Tác giả/thể loại | Quản lý thông tin tác giả và thể loại |
| FR-08 | Tra cứu sách | Tìm theo mã, tên, tác giả, thể loại; xem tình trạng |
| FR-09 | Quản lý độc giả | Thêm, cập nhật, tra cứu hồ sơ độc giả |
| FR-10 | Quản lý thẻ | Theo dõi trạng thái thẻ và điều kiện mượn |
| FR-11 | Mượn sách | Kiểm tra điều kiện, lập phiếu mượn, ghi ngày mượn/hạn trả |
| FR-12 | Trả sách | Ghi nhận ngày trả, cập nhật phiếu và tình trạng bản sao |
| FR-13 | Đặt giữ | Gửi, theo dõi, hủy và xử lý yêu cầu đặt giữ |
| FR-14 | Gia hạn | Gửi, kiểm tra, chấp thuận/từ chối yêu cầu gia hạn |
| FR-15 | Vi phạm | Ghi nhận quá hạn, mất hoặc hư hỏng sách |
| FR-16 | Tiền phạt | Xác định khoản phạt, theo dõi trạng thái xử lý/thanh toán |
| FR-17 | Kiểm kê | Tạo đợt, ghi nhận số lượng thực tế, đối chiếu và cập nhật tình trạng |
| FR-18 | Báo cáo | Thống kê đầu sách, bản sao, độc giả, mượn/trả, quá hạn, vi phạm và tiền phạt |
| FR-19 | Lịch sử cá nhân | Độc giả xem sách đang mượn, hạn trả và lịch sử mượn/trả của mình |

### 1.5.1. Quản lý sách

Thông tin đầu sách có thể gồm mã sách, tên sách, tác giả, nhà xuất bản, năm xuất bản, thể loại và thông tin mô tả. Mỗi bản sao có mã riêng và trạng thái như sẵn sàng cho mượn, đang được mượn, đang được giữ, hư hỏng hoặc mất. Danh sách trạng thái chính thức cần được nhóm thống nhất.

### 1.5.2. Quản lý độc giả

Thông tin có thể gồm mã độc giả, họ tên, thông tin liên hệ, đối tượng (sinh viên/giảng viên) và trạng thái thẻ. Hệ thống hỗ trợ kiểm tra trạng thái thẻ và điều kiện mượn trước khi tạo giao dịch.

### 1.5.3. Mượn và trả sách

Trước khi xác nhận mượn, hệ thống kiểm tra độc giả có đủ điều kiện, bản sao có thể cho mượn và giới hạn mượn có được đáp ứng hay không. Khi trả, hệ thống ghi nhận thời điểm trả, kiểm tra tình trạng tài liệu và xác định trường hợp quá hạn hoặc hư hỏng để ghi nhận vi phạm.

### 1.5.4. Đặt giữ và gia hạn

Độc giả có thể gửi yêu cầu đặt giữ và theo dõi trạng thái. Độc giả có thể gửi yêu cầu gia hạn cho lượt mượn đang còn hiệu lực. Hệ thống kiểm tra quy định, ví dụ sách đang có người khác chờ hoặc lượt mượn đã quá hạn có thể là điều kiện từ chối. Điều kiện cụ thể cần nhóm chốt.

### 1.5.5. Vi phạm và tiền phạt

Các trường hợp có thể ghi nhận gồm trả quá hạn, mất sách và hư hỏng sách. Nhân viên ghi nhận vi phạm, xác định khoản phạt theo quy định và theo dõi trạng thái xử lý. Phiên bản đồ án không tích hợp cổng thanh toán trực tuyến.

### 1.5.6. Kiểm kê và báo cáo

Kiểm kê được thực hiện thủ công: tạo đợt kiểm kê, ghi nhận số lượng/thực trạng, đối chiếu với dữ liệu hệ thống và ghi nhận chênh lệch. Báo cáo cơ bản gồm số đầu sách/bản sao, số độc giả, lượt mượn/trả, sách đang mượn, sách quá hạn, vi phạm và tiền phạt.

### 1.5.7. Tài khoản, phân quyền và giám sát

Hệ thống hỗ trợ đăng nhập/đăng xuất, tạo/cập nhật/khóa tài khoản, phân quyền theo vai trò, cấu hình thông số được phép và lưu log đăng nhập/thao tác quan trọng. Không ghi log mật khẩu, token hoặc dữ liệu bí mật.

## 1.6. Yêu cầu phi chức năng

| Mã | Nhóm | Yêu cầu |
|---|---|---|
| NFR-01 | Bảo mật | Endpoint riêng tư yêu cầu xác thực và kiểm tra quyền |
| NFR-02 | Bảo mật | Mật khẩu lưu dưới dạng hash an toàn, không lưu dạng rõ |
| NFR-03 | Bảo mật | Secrets không được commit lên GitHub |
| NFR-04 | Hiệu năng | API danh sách hỗ trợ phân trang và lọc phù hợp |
| NFR-05 | Nhất quán | Mượn/trả/đặt giữ phải kiểm tra trạng thái bản sao, tránh xử lý trùng |
| NFR-06 | Bảo trì | Mỗi service có trách nhiệm và schema riêng |
| NFR-07 | Mở rộng | Có thể bổ sung service hoặc tích hợp mới mà hạn chế phụ thuộc trực tiếp |
| NFR-08 | Tương thích | Các service giao tiếp qua API HTTP/JSON có version |
| NFR-09 | Triển khai | Thành viên có thể dựng môi trường local theo tài liệu |
| NFR-10 | Giám sát | Ghi nhận lỗi và thao tác quan trọng, có request/correlation ID nếu khả thi |
| NFR-11 | Dữ liệu | Có quy trình migration và sao lưu/khôi phục database |

Các chỉ tiêu định lượng về response time, số người dùng đồng thời và dung lượng dữ liệu: TODO nhóm/giảng viên xác nhận.

## 1.7. Quy tắc nghiệp vụ cần thống nhất

Không tự đặt các con số dưới đây thành quy định chính thức:

- Số bản sao tối đa một độc giả được mượn cùng lúc.
- Thời hạn mượn.
- Số lần và thời gian gia hạn.
- Điều kiện gia hạn khi có người đặt giữ.
- Cách xếp hàng và thời hạn nhận sách đặt giữ.
- Điều kiện hủy đặt giữ.
- Mức phạt theo ngày, mất sách hoặc hư hỏng.
- Quy trình ghi nhận và xử lý chênh lệch kiểm kê.
- Quyền duyệt yêu cầu đặt giữ/gia hạn.
- Các trạng thái chính thức của độc giả, bản sao, phiếu mượn và khoản phạt.

## 1.8. Tiêu chí nghiệm thu đề xuất

- Ba nhóm người dùng được phân quyền phù hợp.
- Nhân viên quản lý được đầu sách, bản sao và độc giả.
- Độc giả tra cứu sách và xem được tình trạng bản sao.
- Nhân viên thực hiện được mượn/trả.
- Độc giả gửi được yêu cầu đặt giữ/gia hạn và theo dõi kết quả.
- Hệ thống ghi nhận được quá hạn, vi phạm và khoản phạt.
- Nhân viên tạo và hoàn tất được đợt kiểm kê thủ công.
- Người có quyền xem được báo cáo cơ bản và log cần thiết.
- Các service tích hợp qua API Gateway.
- Thành viên khác có thể clone GitHub repository và chạy theo hướng dẫn.
