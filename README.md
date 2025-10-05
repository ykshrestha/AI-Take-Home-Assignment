# 🎓 Scholarship Validity Platform (Yashaswini Kulshrestha -Shipsy AI campus Assignment)

A web application to manage and validate scholarship records with complete CRUD functionality.  
Built as part of the **Shipsy AI Campus Assignment**, it demonstrates clean backend design, PostgreSQL integration, and responsive UI using Tailwind CSS.

---

## 🚀 Live Deployment

- **Frontend:** [https://take-ai-campus-qfpo-git-main-doohgles-projects.vercel.app/](https://take-ai-campus-qfpo-git-main-doohgles-projects.vercel.app/)  
- **Backend API:** [https://take-ai-campus-3.onrender.com](https://take-ai-campus-3.onrender.com)  
- **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1_eyBRUZfHQoqRXWz2U5NcE-xwH6bR610/view?usp=sharing)  
- **Postman Collection:** [View API Documentation](https://www.postman.com/) *(replace with your shared Postman link if available)*  

---

## 🧩 Overview

The **Scholarship Validity Platform** provides a simple interface to:
- Add, view, update, and delete scholarship records.
- Automatically compute validity duration from date inputs.
- Use pagination and filters to view records efficiently.

The project was developed using **TypeScript**, ensuring reliability and maintainability in both API logic and database operations.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** — Runtime environment  
- **Express.js** — RESTful API framework  
- **TypeScript** — Strong typing and modular design  
- **PostgreSQL** — Relational database  

### Frontend
- **Tailwind CSS** — Fast and responsive styling  

### Testing & Documentation
- **Postman** — API testing and documentation  
- **Shell Script** — Setup and validation testing  

---

## ⚙️ Features

| Feature | Description |
|----------|-------------|
| 🔐 Authentication | Basic username/password login system |
| 🧾 CRUD Operations | Create, Read, Update, Delete scholarship records |
| 🧮 Calculated Field | Automatically computes scholarship validity duration |
| 📑 Pagination | Displays limited data per page |
| 🔍 Filters | Filter scholarships by category or status |
| 🧰 Postman Collection | Ready-to-import API test suite |
| 💾 PostgreSQL Schema | Clean relational data model |

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/login` | User authentication |
| `GET` | `/scholarships` | Fetch paginated list of scholarships |
| `POST` | `/scholarships` | Create a new scholarship record |
| `PUT` | `/scholarships/:id` | Update an existing record |
| `DELETE` | `/scholarships/:id` | Delete a record |

> ✅ All endpoints are tested through **Postman** and documented in the collection linked above.

---

## 🧠 AI & Development Notes

This project was completed within **24 hours** for the AI Campus Challenge.  
AI assistance (Gemini CLI) was used for:
- Code scaffolding and optimization  
- API design suggestions  
- Documentation structure  

---

## 🧰 Local Setup

```bash
# Clone the repository
git clone <repository_url>

# Navigate into the project folder
cd ai-campus-student-portal

# Install dependencies
npm install

# Configure environment variables
# Create a .env file in the root directory and add:
DATABASE_URL=postgresql://user:password@localhost:5432/scholarships

# Run database migrations (if applicable)
npm run migrate

# Start the development server
npm run dev

