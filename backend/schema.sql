-- ============================================================
-- schema.sql
-- MySQL database schema for the Library Management System.
-- Run this script to manually create the database and tables.
-- SQLAlchemy will also auto-create tables on app startup,
-- but this file is useful for documentation and manual setup.
-- ============================================================

-- -----------------------------------------------------------
-- 1. Create the database (if it doesn't exist)
-- -----------------------------------------------------------
CREATE DATABASE IF NOT EXISTS library_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use the database
USE library_db;

-- -----------------------------------------------------------
-- 2. BOOKS TABLE
-- Stores all book records in the library catalog.
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    book_id             INT             NOT NULL AUTO_INCREMENT,
    title               VARCHAR(255)    NOT NULL,
    author              VARCHAR(255)    NOT NULL,
    category            VARCHAR(100)    DEFAULT NULL,
    isbn                VARCHAR(20)     DEFAULT NULL UNIQUE,
    availability_status BOOLEAN         NOT NULL DEFAULT TRUE,

    -- Primary key constraint
    PRIMARY KEY (book_id),

    -- Index for faster ISBN lookups
    INDEX idx_books_isbn (isbn)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 3. BORROWERS TABLE
-- Stores all registered library members (borrowers).
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS borrowers (
    borrower_id     INT             NOT NULL AUTO_INCREMENT,
    borrower_name   VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(20)     DEFAULT NULL,

    -- Primary key constraint
    PRIMARY KEY (borrower_id),

    -- Index for faster email-based lookups
    INDEX idx_borrowers_email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 4. SAMPLE DATA (Optional - for testing)
-- Uncomment the blocks below to seed sample records.
-- -----------------------------------------------------------

-- Sample Books
-- INSERT INTO books (title, author, category, isbn, availability_status) VALUES
-- ('The Great Gatsby',          'F. Scott Fitzgerald', 'Fiction',  '978-0-7432-7356-5', TRUE),
-- ('To Kill a Mockingbird',     'Harper Lee',          'Fiction',  '978-0-06-112008-4', TRUE),
-- ('A Brief History of Time',   'Stephen Hawking',     'Science',  '978-0-553-38016-3', FALSE),
-- ('Clean Code',                'Robert C. Martin',    'Tech',     '978-0-13-235088-4', TRUE),
-- ('The Pragmatic Programmer',  'Andrew Hunt',         'Tech',     '978-0-201-61622-4', TRUE);

-- Sample Borrowers
-- INSERT INTO borrowers (borrower_name, email, phone) VALUES
-- ('Alice Johnson',  'alice@example.com',  '+1-555-123-4567'),
-- ('Bob Smith',      'bob@example.com',    '+1-555-987-6543'),
-- ('Carol White',    'carol@example.com',  NULL);
