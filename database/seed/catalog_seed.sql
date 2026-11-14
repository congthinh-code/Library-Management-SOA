
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- =========================================
    -- 1. CATEGORIES
    -- =========================================

    IF NOT EXISTS (
        SELECT 1 FROM catalog.categories
        WHERE name = N'Văn học'
    )
    INSERT INTO catalog.categories
        (name, description, created_at, updated_at)
    VALUES
        (N'Văn học', N'Sách văn học, truyện và tiểu thuyết',
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.categories
        WHERE name = N'Kỹ năng sống'
    )
    INSERT INTO catalog.categories
        (name, description, created_at, updated_at)
    VALUES
        (N'Kỹ năng sống', N'Sách phát triển bản thân và kỹ năng',
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.categories
        WHERE name = N'Khoa học'
    )
    INSERT INTO catalog.categories
        (name, description, created_at, updated_at)
    VALUES
        (N'Khoa học', N'Sách khoa học và kiến thức tổng hợp',
         SYSDATETIME(), SYSDATETIME());

    -- Lấy ID danh mục
    DECLARE @VanHoc BIGINT, @KyNang BIGINT, @KhoaHoc BIGINT;

    SELECT @VanHoc = category_id FROM catalog.categories
    WHERE name = N'Văn học';

    SELECT @KyNang = category_id FROM catalog.categories
    WHERE name = N'Kỹ năng sống';

    SELECT @KhoaHoc = category_id FROM catalog.categories
    WHERE name = N'Khoa học';


    -- =========================================
    -- 2. AUTHORS
    -- =========================================

    IF NOT EXISTS (
        SELECT 1 FROM catalog.authors
        WHERE name = N'Nguyễn Nhật Ánh'
    )
    INSERT INTO catalog.authors
        (name, biography, created_at, updated_at)
    VALUES
        (N'Nguyễn Nhật Ánh', N'Nhà văn Việt Nam nổi tiếng với các tác phẩm viết về tuổi thơ.',
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.authors
        WHERE name = N'Tô Hoài'
    )
    INSERT INTO catalog.authors
        (name, biography, created_at, updated_at)
    VALUES
        (N'Tô Hoài', N'Nhà văn Việt Nam, tác giả Dế Mèn phiêu lưu ký.',
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.authors
        WHERE name = N'Paulo Coelho'
    )
    INSERT INTO catalog.authors
        (name, biography, created_at, updated_at)
    VALUES
        (N'Paulo Coelho', N'Nhà văn người Brazil.',
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.authors
        WHERE name = N'Dale Carnegie'
    )
    INSERT INTO catalog.authors
        (name, biography, created_at, updated_at)
    VALUES
        (N'Dale Carnegie', N'Tác giả sách phát triển bản thân người Mỹ.',
         SYSDATETIME(), SYSDATETIME());

    -- Bổ sung tác giả cho các sách mới
    INSERT INTO catalog.authors
        (name, biography, created_at, updated_at)
    SELECT v.name, v.biography, SYSDATETIME(), SYSDATETIME()
    FROM (VALUES
        (N'Nguyễn Du', N'Đại thi hào Việt Nam, tác giả Truyện Kiều.'),
        (N'Nam Cao', N'Nhà văn hiện thực Việt Nam.'),
        (N'Vũ Trọng Phụng', N'Nhà văn Việt Nam.'),
        (N'Nguyễn Ngọc Tư', N'Nhà văn Việt Nam đương đại.'),
        (N'Haruki Murakami', N'Nhà văn Nhật Bản.'),
        (N'J.K. Rowling', N'Nhà văn Anh, tác giả Harry Potter.'),
        (N'George Orwell', N'Nhà văn Anh.'),
        (N'Dan Brown', N'Nhà văn Mỹ.'),
        (N'Adam Khoo', N'Tác giả sách phát triển bản thân.'),
        (N'Napoleon Hill', N'Tác giả sách phát triển bản thân.'),
        (N'Rosie Nguyễn', N'Tác giả Việt Nam.'),
        (N'Robert T. Kiyosaki', N'Tác giả sách tài chính cá nhân.'),
        (N'Stephen Hawking', N'Nhà vật lý lý thuyết người Anh.'),
        (N'Yuval Noah Harari', N'Sử gia người Israel.'),
        (N'Robin Sharma', N'Tác giả sách phát triển bản thân.'),
        (N'Joseph Murphy', N'Tác giả sách phát triển bản thân.'),
        (N'J.D. Salinger', N'Nhà văn Mỹ.'),
        (N'Antoine de Saint-Exupéry', N'Nhà văn Pháp.'),
        (N'Hector Malot', N'Nhà văn Pháp.'),
        (N'Victor Hugo', N'Nhà văn Pháp.')
    ) AS v(name, biography)
    WHERE NOT EXISTS (
        SELECT 1 FROM catalog.authors a
        WHERE a.name = v.name
    );
    -- Lấy ID tác giả
    DECLARE @NguyenNhatAnh BIGINT, @ToHoai BIGINT;
    DECLARE @PauloCoelho BIGINT, @DaleCarnegie BIGINT;

    SELECT @NguyenNhatAnh = author_id FROM catalog.authors
    WHERE name = N'Nguyễn Nhật Ánh';

    SELECT @ToHoai = author_id FROM catalog.authors
    WHERE name = N'Tô Hoài';

    SELECT @PauloCoelho = author_id FROM catalog.authors
    WHERE name = N'Paulo Coelho';

    SELECT @DaleCarnegie = author_id FROM catalog.authors
    WHERE name = N'Dale Carnegie';


    -- =========================================
    -- Lấy ID các tác giả mới
    DECLARE @NguyenDu BIGINT, @NamCao BIGINT, @VuTrongPhung BIGINT;
    DECLARE @NguyenNgocTu BIGINT, @HarukiMurakami BIGINT, @JKRowling BIGINT;
    DECLARE @GeorgeOrwell BIGINT, @DanBrown BIGINT, @AdamKhoo BIGINT;
    DECLARE @NapoleonHill BIGINT, @RosieNguyen BIGINT, @RobertKiyosaki BIGINT;
    DECLARE @StephenHawking BIGINT, @YuvalHarari BIGINT, @RobinSharma BIGINT;
    DECLARE @JosephMurphy BIGINT, @JDSalinger BIGINT, @AntoineExupery BIGINT;
    DECLARE @HectorMalot BIGINT, @VictorHugo BIGINT;

    SELECT @NguyenDu = author_id FROM catalog.authors WHERE name = N'Nguyễn Du';
    SELECT @NamCao = author_id FROM catalog.authors WHERE name = N'Nam Cao';
    SELECT @VuTrongPhung = author_id FROM catalog.authors WHERE name = N'Vũ Trọng Phụng';
    SELECT @NguyenNgocTu = author_id FROM catalog.authors WHERE name = N'Nguyễn Ngọc Tư';
    SELECT @HarukiMurakami = author_id FROM catalog.authors WHERE name = N'Haruki Murakami';
    SELECT @JKRowling = author_id FROM catalog.authors WHERE name = N'J.K. Rowling';
    SELECT @GeorgeOrwell = author_id FROM catalog.authors WHERE name = N'George Orwell';
    SELECT @DanBrown = author_id FROM catalog.authors WHERE name = N'Dan Brown';
    SELECT @AdamKhoo = author_id FROM catalog.authors WHERE name = N'Adam Khoo';
    SELECT @NapoleonHill = author_id FROM catalog.authors WHERE name = N'Napoleon Hill';
    SELECT @RosieNguyen = author_id FROM catalog.authors WHERE name = N'Rosie Nguyễn';
    SELECT @RobertKiyosaki = author_id FROM catalog.authors WHERE name = N'Robert T. Kiyosaki';
    SELECT @StephenHawking = author_id FROM catalog.authors WHERE name = N'Stephen Hawking';
    SELECT @YuvalHarari = author_id FROM catalog.authors WHERE name = N'Yuval Noah Harari';
    SELECT @RobinSharma = author_id FROM catalog.authors WHERE name = N'Robin Sharma';
    SELECT @JosephMurphy = author_id FROM catalog.authors WHERE name = N'Joseph Murphy';
    SELECT @JDSalinger = author_id FROM catalog.authors WHERE name = N'J.D. Salinger';
    SELECT @AntoineExupery = author_id FROM catalog.authors WHERE name = N'Antoine de Saint-Exupéry';
    SELECT @HectorMalot = author_id FROM catalog.authors WHERE name = N'Hector Malot';
    SELECT @VictorHugo = author_id FROM catalog.authors WHERE name = N'Victor Hugo';
    -- 3. BOOKS
    -- =========================================

    IF NOT EXISTS (
        SELECT 1 FROM catalog.books
        WHERE title = N'Tôi thấy hoa vàng trên cỏ xanh'
          AND publisher = N'NXB Trẻ'
    )
    INSERT INTO catalog.books
        (isbn, title, description, publisher, published_year,
         category_id, created_at, updated_at)
    VALUES
        (N'9786041234501', N'Tôi thấy hoa vàng trên cỏ xanh',
         N'Câu chuyện tuổi thơ đầy cảm xúc.',
         N'NXB Trẻ', 2010, @VanHoc,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.books
        WHERE title = N'Cho tôi xin một vé đi tuổi thơ'
          AND publisher = N'NXB Trẻ'
    )
    INSERT INTO catalog.books
        (isbn, title, description, publisher, published_year,
         category_id, created_at, updated_at)
    VALUES
        (N'9786041234502', N'Cho tôi xin một vé đi tuổi thơ',
         N'Tác phẩm viết về ký ức tuổi thơ.',
         N'NXB Trẻ', 2008, @VanHoc,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.books
        WHERE title = N'Dế Mèn phiêu lưu ký'
          AND publisher = N'NXB Kim Đồng'
    )
    INSERT INTO catalog.books
        (isbn, title, description, publisher, published_year,
         category_id, created_at, updated_at)
    VALUES
        (N'9786041234503', N'Dế Mèn phiêu lưu ký',
         N'Cuộc phiêu lưu của chú dế mèn.',
         N'NXB Kim Đồng', 1941, @VanHoc,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.books
        WHERE title = N'Nhà giả kim'
          AND publisher = N'NXB Văn học'
    )
    INSERT INTO catalog.books
        (isbn, title, description, publisher, published_year,
         category_id, created_at, updated_at)
    VALUES
        (N'9786041234504', N'Nhà giả kim',
         N'Câu chuyện về hành trình theo đuổi ước mơ.',
         N'NXB Văn học', 1988, @VanHoc,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.books
        WHERE title = N'Đắc nhân tâm'
          AND publisher = N'NXB Tổng hợp'
    )
    INSERT INTO catalog.books
        (isbn, title, description, publisher, published_year,
         category_id, created_at, updated_at)
    VALUES
        (N'9786041234505', N'Đắc nhân tâm',
         N'Sách về nghệ thuật giao tiếp và ứng xử.',
         N'NXB Tổng hợp', 1936, @KyNang,
         SYSDATETIME(), SYSDATETIME());


    -- =========================================
    -- 25 sách bổ sung (tổng cộng 30 sách)
    INSERT INTO catalog.books
        (isbn, title, description, publisher, published_year,
         category_id, created_at, updated_at)
    SELECT
        v.isbn, v.title, v.description, v.publisher, v.published_year,
        v.category_id, SYSDATETIME(), SYSDATETIME()
    FROM (VALUES
        (N'9786041234510', N'Mắt biếc', N'Câu chuyện tình cảm tuổi học trò.', N'NXB Trẻ', 1990, @VanHoc),
        (N'9786041234511', N'Cô gái đến từ hôm qua', N'Câu chuyện về tình bạn và tình yêu tuổi học trò.', N'NXB Trẻ', 1989, @VanHoc),
        (N'9786041234512', N'Truyện Kiều', N'Tác phẩm thơ kinh điển của văn học Việt Nam.', N'NXB Văn học', 1820, @VanHoc),
        (N'9786041234513', N'Chí Phèo', N'Truyện ngắn tiêu biểu của văn học hiện thực Việt Nam.', N'NXB Văn học', 1941, @VanHoc),
        (N'9786041234514', N'Số đỏ', N'Tiểu thuyết trào phúng nổi tiếng.', N'NXB Văn học', 1936, @VanHoc),
        (N'9786041234515', N'Cánh đồng bất tận', N'Tập truyện về cuộc sống miền Tây Nam Bộ.', N'NXB Trẻ', 2005, @VanHoc),
        (N'9786041234516', N'Rừng Na Uy', N'Tiểu thuyết về tình yêu, mất mát và trưởng thành.', N'NXB Hội Nhà Văn', 1987, @VanHoc),
        (N'9786041234517', N'Harry Potter và Hòn đá Phù thủy', N'Tập đầu tiên trong series Harry Potter.', N'NXB Trẻ', 1997, @VanHoc),
        (N'9786041234518', N'1984', N'Tiểu thuyết phản địa đàng về xã hội toàn trị.', N'NXB Hội Nhà Văn', 1949, @VanHoc),
        (N'9786041234519', N'Mật mã Da Vinci', N'Tiểu thuyết trinh thám xoay quanh những bí ẩn lịch sử.', N'NXB Văn học', 2003, @VanHoc),
        (N'9786041234520', N'Tôi tài giỏi, bạn cũng thế!', N'Sách về phương pháp học tập và phát triển bản thân.', N'NXB Phụ Nữ', 2006, @KyNang),
        (N'9786041234521', N'Nghĩ giàu làm giàu', N'Sách về tư duy và nguyên tắc thành công.', N'NXB Tổng hợp', 1937, @KyNang),
        (N'9786041234522', N'Tuổi trẻ đáng giá bao nhiêu', N'Sách chia sẻ trải nghiệm học tập và phát triển bản thân.', N'NXB Hội Nhà Văn', 2016, @KyNang),
        (N'9786041234523', N'Dạy con làm giàu - Tập 1', N'Sách nhập môn về tư duy tài chính cá nhân.', N'NXB Trẻ', 1997, @KyNang),
        (N'9786041234524', N'Lược sử thời gian', N'Sách phổ thông giới thiệu về vũ trụ học.', N'NXB Trẻ', 1988, @KhoaHoc),
        (N'9786041234525', N'Sapiens: Lược sử loài người', N'Khảo cứu về lịch sử và sự phát triển của loài người.', N'NXB Thế Giới', 2011, @KhoaHoc),
        (N'9786041234526', N'Nhà lãnh đạo không chức danh', N'Sách về tư duy lãnh đạo và phát triển bản thân.', N'NXB Trẻ', 2010, @KyNang),
        (N'9786041234527', N'Quẳng gánh lo đi và vui sống', N'Sách về cách ứng phó với lo lắng trong cuộc sống.', N'NXB Tổng hợp', 1948, @KyNang),
        (N'9786041234528', N'Sức mạnh tiềm thức', N'Sách về tâm trí và sức mạnh của tiềm thức.', N'NXB Tổng hợp', 1963, @KyNang),
        (N'9786041234529', N'Bắt trẻ đồng xanh', N'Tiểu thuyết về tuổi trẻ và hành trình trưởng thành.', N'NXB Hội Nhà Văn', 1951, @VanHoc),
        (N'9786041234530', N'Hoàng tử bé', N'Tác phẩm văn học thiếu nhi giàu ý nghĩa nhân văn.', N'NXB Kim Đồng', 1943, @VanHoc),
        (N'9786041234531', N'Không gia đình', N'Tiểu thuyết kể về hành trình của cậu bé Rémi.', N'NXB Kim Đồng', 1878, @VanHoc),
        (N'9786041234532', N'Những người khốn khổ', N'Tiểu thuyết về số phận con người và xã hội Pháp.', N'NXB Văn học', 1862, @VanHoc),
        (N'9786041234533', N'Vũ trụ trong vỏ hạt dẻ', N'Sách phổ thông về những vấn đề lớn của vật lý hiện đại.', N'NXB Trẻ', 2001, @KhoaHoc),
        (N'9786041234534', N'Homo Deus: Lược sử tương lai', N'Khảo cứu về tương lai và những thách thức của nhân loại.', N'NXB Thế Giới', 2015, @KhoaHoc)
    ) AS v(isbn, title, description, publisher, published_year, category_id)
    WHERE NOT EXISTS (
        SELECT 1
        FROM catalog.books b
        WHERE b.isbn = v.isbn
    );
    -- 4. BOOK_AUTHORS
    -- =========================================

    DECLARE @Book1 BIGINT, @Book2 BIGINT, @Book3 BIGINT;
    DECLARE @Book4 BIGINT, @Book5 BIGINT;

    SELECT @Book1 = book_id FROM catalog.books
    WHERE title = N'Tôi thấy hoa vàng trên cỏ xanh'
      AND publisher = N'NXB Trẻ';

    SELECT @Book2 = book_id FROM catalog.books
    WHERE title = N'Cho tôi xin một vé đi tuổi thơ'
      AND publisher = N'NXB Trẻ';

    SELECT @Book3 = book_id FROM catalog.books
    WHERE title = N'Dế Mèn phiêu lưu ký'
      AND publisher = N'NXB Kim Đồng';

    SELECT @Book4 = book_id FROM catalog.books
    WHERE title = N'Nhà giả kim'
      AND publisher = N'NXB Văn học';

    SELECT @Book5 = book_id FROM catalog.books
    WHERE title = N'Đắc nhân tâm'
      AND publisher = N'NXB Tổng hợp';

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_authors
        WHERE book_id = @Book1 AND author_id = @NguyenNhatAnh
    )
    INSERT INTO catalog.book_authors (book_id, author_id)
    VALUES (@Book1, @NguyenNhatAnh);

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_authors
        WHERE book_id = @Book2 AND author_id = @NguyenNhatAnh
    )
    INSERT INTO catalog.book_authors (book_id, author_id)
    VALUES (@Book2, @NguyenNhatAnh);

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_authors
        WHERE book_id = @Book3 AND author_id = @ToHoai
    )
    INSERT INTO catalog.book_authors (book_id, author_id)
    VALUES (@Book3, @ToHoai);

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_authors
        WHERE book_id = @Book4 AND author_id = @PauloCoelho
    )
    INSERT INTO catalog.book_authors (book_id, author_id)
    VALUES (@Book4, @PauloCoelho);

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_authors
        WHERE book_id = @Book5 AND author_id = @DaleCarnegie
    )
    INSERT INTO catalog.book_authors (book_id, author_id)
    VALUES (@Book5, @DaleCarnegie);


    -- =========================================
    -- Liên kết 25 sách bổ sung với tác giả
    INSERT INTO catalog.book_authors (book_id, author_id)
    SELECT b.book_id, a.author_id
    FROM (VALUES
        (N'9786041234510', N'Nguyễn Nhật Ánh'),
        (N'9786041234511', N'Nguyễn Nhật Ánh'),
        (N'9786041234512', N'Nguyễn Du'),
        (N'9786041234513', N'Nam Cao'),
        (N'9786041234514', N'Vũ Trọng Phụng'),
        (N'9786041234515', N'Nguyễn Ngọc Tư'),
        (N'9786041234516', N'Haruki Murakami'),
        (N'9786041234517', N'J.K. Rowling'),
        (N'9786041234518', N'George Orwell'),
        (N'9786041234519', N'Dan Brown'),
        (N'9786041234520', N'Adam Khoo'),
        (N'9786041234521', N'Napoleon Hill'),
        (N'9786041234522', N'Rosie Nguyễn'),
        (N'9786041234523', N'Robert T. Kiyosaki'),
        (N'9786041234524', N'Stephen Hawking'),
        (N'9786041234525', N'Yuval Noah Harari'),
        (N'9786041234526', N'Robin Sharma'),
        (N'9786041234527', N'Dale Carnegie'),
        (N'9786041234528', N'Joseph Murphy'),
        (N'9786041234529', N'J.D. Salinger'),
        (N'9786041234530', N'Antoine de Saint-Exupéry'),
        (N'9786041234531', N'Hector Malot'),
        (N'9786041234532', N'Victor Hugo'),
        (N'9786041234533', N'Stephen Hawking'),
        (N'9786041234534', N'Yuval Noah Harari')
    ) AS v(isbn, author_name)
    INNER JOIN catalog.books b ON b.isbn = v.isbn
    INNER JOIN catalog.authors a ON a.name = v.author_name
    WHERE NOT EXISTS (
        SELECT 1
        FROM catalog.book_authors ba
        WHERE ba.book_id = b.book_id
          AND ba.author_id = a.author_id
    );
    -- 5. BOOK_COPIES
    -- =========================================

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_copies
        WHERE copy_code = N'SEED-BOOK-001'
    )
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    VALUES
        (N'SEED-BOOK-001', N'AVAILABLE', @Book1,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_copies
        WHERE copy_code = N'SEED-BOOK-002'
    )
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    VALUES
        (N'SEED-BOOK-002', N'AVAILABLE', @Book1,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_copies
        WHERE copy_code = N'SEED-BOOK-003'
    )
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    VALUES
        (N'SEED-BOOK-003', N'AVAILABLE', @Book2,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_copies
        WHERE copy_code = N'SEED-BOOK-004'
    )
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    VALUES
        (N'SEED-BOOK-004', N'AVAILABLE', @Book3,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_copies
        WHERE copy_code = N'SEED-BOOK-005'
    )
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    VALUES
        (N'SEED-BOOK-005', N'AVAILABLE', @Book4,
         SYSDATETIME(), SYSDATETIME());

    IF NOT EXISTS (
        SELECT 1 FROM catalog.book_copies
        WHERE copy_code = N'SEED-BOOK-006'
    )
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    VALUES
        (N'SEED-BOOK-006', N'AVAILABLE', @Book5,
         SYSDATETIME(), SYSDATETIME());

    -- Thêm 2 bản sao cho mỗi sách bổ sung
    INSERT INTO catalog.book_copies
        (copy_code, status, book_id, created_at, updated_at)
    SELECT
        N'SEED-BOOK-' + RIGHT('000' + CAST(6 + ((v.book_no - 1) * 2) + c.copy_no AS VARCHAR(3)), 3),
        N'AVAILABLE',
        b.book_id,
        SYSDATETIME(),
        SYSDATETIME()
    FROM (VALUES
        (1, N'9786041234510'),
        (2, N'9786041234511'),
        (3, N'9786041234512'),
        (4, N'9786041234513'),
        (5, N'9786041234514'),
        (6, N'9786041234515'),
        (7, N'9786041234516'),
        (8, N'9786041234517'),
        (9, N'9786041234518'),
        (10, N'9786041234519'),
        (11, N'9786041234520'),
        (12, N'9786041234521'),
        (13, N'9786041234522'),
        (14, N'9786041234523'),
        (15, N'9786041234524'),
        (16, N'9786041234525'),
        (17, N'9786041234526'),
        (18, N'9786041234527'),
        (19, N'9786041234528'),
        (20, N'9786041234529'),
        (21, N'9786041234530'),
        (22, N'9786041234531'),
        (23, N'9786041234532'),
        (24, N'9786041234533'),
        (25, N'9786041234534')
    ) AS v(book_no, isbn)
    INNER JOIN catalog.books b ON b.isbn = v.isbn
    CROSS JOIN (VALUES (1), (2)) AS c(copy_no)
    WHERE NOT EXISTS (
        SELECT 1
        FROM catalog.book_copies bc
        WHERE bc.copy_code =
            N'SEED-BOOK-' + RIGHT('000' + CAST(6 + ((v.book_no - 1) * 2) + c.copy_no AS VARCHAR(3)), 3)
    );
    COMMIT TRANSACTION;

    PRINT N'Catalog seed data inserted successfully.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;