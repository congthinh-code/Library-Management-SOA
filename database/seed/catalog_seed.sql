
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

    COMMIT TRANSACTION;

    PRINT N'Catalog seed data inserted successfully.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
