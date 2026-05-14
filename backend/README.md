# 📚 Library Management System — Backend (Step 1)

A modular, production-ready RESTful API for managing library books and borrowers.
Built with **FastAPI**, **SQLAlchemy**, and **MySQL** as part of an academic capstone project.

---

## 🏗️ Project Structure

```
backend/
│
├── app/
│   ├── main.py               ← FastAPI app entry point
│   ├── database.py           ← SQLAlchemy engine, session, Base
│   ├── config/
│   │   └── settings.py       ← Environment variable loader (pydantic-settings)
│   ├── models/
│   │   ├── book_model.py     ← SQLAlchemy ORM model for Books
│   │   └── borrower_model.py ← SQLAlchemy ORM model for Borrowers
│   ├── schemas/
│   │   ├── book_schema.py    ← Pydantic request/response schemas for Books
│   │   └── borrower_schema.py← Pydantic request/response schemas for Borrowers
│   ├── crud/
│   │   ├── book_crud.py      ← Database operations for Books
│   │   └── borrower_crud.py  ← Database operations for Borrowers
│   ├── routers/
│   │   ├── books_router.py   ← API route handlers for Books
│   │   └── borrowers_router.py ← API route handlers for Borrowers
│   ├── services/             ← Business logic (future steps)
│   └── utils/                ← Helper utilities (future steps)
│
├── schema.sql                ← MySQL schema (manual setup reference)
├── requirements.txt          ← Python dependencies
├── .env                      ← Environment variables (gitignored)
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

| Tool    | Version  | Download |
|---------|----------|----------|
| Python  | 3.10+    | [python.org](https://python.org) |
| MySQL   | 8.0+     | [mysql.com](https://mysql.com) |
| Git     | Latest   | [git-scm.com](https://git-scm.com) |

---

## 🚀 Setup Instructions

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system/backend
```

### Step 2 — Create a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3 — Install dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Create the MySQL database

Log into MySQL and run:

```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or run the provided schema file directly:

```bash
mysql -u root -p < schema.sql
```

### Step 5 — Configure environment variables

Edit the `.env` file in the `backend/` directory:

```env
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/library_db
APP_NAME=Library Management System
APP_VERSION=1.0.0
DEBUG=True
```

> ⚠️ Replace `your_password` with your actual MySQL root password.

### Step 6 — Run the application

```bash
# From the backend/ directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will start at: **http://localhost:8000**

---

## 📖 API Documentation

Once the server is running, visit:

| Interface | URL |
|-----------|-----|
| **Swagger UI** (Interactive) | http://localhost:8000/docs |
| **ReDoc** (Readable)         | http://localhost:8000/redoc |
| **OpenAPI JSON**             | http://localhost:8000/openapi.json |

---

## 🔌 API Endpoints

### 📘 Books

| Method   | Endpoint          | Description              | Status Code |
|----------|-------------------|--------------------------|-------------|
| `GET`    | `/books/`         | Get all books            | 200         |
| `GET`    | `/books/{id}`     | Get a book by ID         | 200 / 404   |
| `POST`   | `/books/`         | Add a new book           | 201         |
| `PUT`    | `/books/{id}`     | Update a book            | 200 / 404   |
| `DELETE` | `/books/{id}`     | Delete a book            | 200 / 404   |

### 👤 Borrowers

| Method   | Endpoint              | Description                 | Status Code |
|----------|-----------------------|-----------------------------|-------------|
| `GET`    | `/borrowers/`         | Get all borrowers           | 200         |
| `POST`   | `/borrowers/`         | Register a new borrower     | 201         |
| `PUT`    | `/borrowers/{id}`     | Update a borrower           | 200 / 404   |
| `DELETE` | `/borrowers/{id}`     | Delete a borrower           | 200 / 404   |

---

## 🧪 API Testing Examples

### Test with curl

**Create a Book:**
```bash
curl -X POST http://localhost:8000/books/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Tech",
    "isbn": "978-0-13-235088-4",
    "availability_status": true
  }'
```

**Get All Books:**
```bash
curl http://localhost:8000/books/
```

**Get Book by ID:**
```bash
curl http://localhost:8000/books/1
```

**Update a Book:**
```bash
curl -X PUT http://localhost:8000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"availability_status": false}'
```

**Delete a Book:**
```bash
curl -X DELETE http://localhost:8000/books/1
```

**Register a Borrower:**
```bash
curl -X POST http://localhost:8000/borrowers/ \
  -H "Content-Type: application/json" \
  -d '{
    "borrower_name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+1-555-123-4567"
  }'
```

---

## 🗄️ Database Schema

### `books` table

| Column               | Type          | Constraints               |
|----------------------|---------------|---------------------------|
| `book_id`            | INT           | PRIMARY KEY, AUTO_INCREMENT |
| `title`              | VARCHAR(255)  | NOT NULL                  |
| `author`             | VARCHAR(255)  | NOT NULL                  |
| `category`           | VARCHAR(100)  | NULL                      |
| `isbn`               | VARCHAR(20)   | UNIQUE, NULL              |
| `availability_status`| BOOLEAN       | NOT NULL, DEFAULT TRUE    |

### `borrowers` table

| Column           | Type          | Constraints               |
|------------------|---------------|---------------------------|
| `borrower_id`    | INT           | PRIMARY KEY, AUTO_INCREMENT |
| `borrower_name`  | VARCHAR(255)  | NOT NULL                  |
| `email`          | VARCHAR(255)  | NOT NULL, UNIQUE          |
| `phone`          | VARCHAR(20)   | NULL                      |

---

## 🐙 Git Commit Messages

Follow this workflow after completing Step 1:

```bash
# Initialize repository
git init
git add .
git commit -m "chore: initialize project structure and backend foundation"

# After setting up database and models
git add app/database.py app/models/
git commit -m "feat: add SQLAlchemy database setup and ORM models (books, borrowers)"

# After adding schemas
git add app/schemas/
git commit -m "feat: add Pydantic schemas for books and borrowers with validation"

# After adding CRUD
git add app/crud/
git commit -m "feat: implement CRUD operations for books and borrowers modules"

# After adding routers
git add app/routers/ app/main.py
git commit -m "feat: add FastAPI routers for books and borrowers with full CRUD endpoints"

# After adding config and env
git add app/config/ requirements.txt .env.example .gitignore
git commit -m "chore: add config settings, requirements, gitignore, and env template"

# Final Step 1 tag
git tag -a v1.0.0-step1 -m "Step 1: Backend foundation and core CRUD APIs"
git push origin main --tags
```

---

## 🧱 Architecture Overview

```
Client (Swagger/curl/Postman)
         │
         ▼
   FastAPI Router            ← HTTP layer: validates request, calls CRUD
         │
         ▼
    CRUD Functions           ← Database layer: SQLAlchemy queries
         │
         ▼
  SQLAlchemy ORM             ← Maps Python objects to MySQL tables
         │
         ▼
   MySQL Database            ← Persistent data storage
```

---

## 🔮 What's Next (Step 2)

- Borrow and Return workflow (Transactions module)
- Borrow history and due dates
- Authentication (JWT tokens)
- Role-based access control (Admin vs Member)

---

## 👩‍💻 Author

**Yasaswini Desai K**
Capstone Academic Project — Library Management System
