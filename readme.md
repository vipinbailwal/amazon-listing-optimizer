<div align="center">

# 📦 Amazon Listing Optimizer

**An AI-powered tool that enhances Amazon product listings by scraping product data and generating optimized content using artificial intelligence.**

[React](https://reactjs.org/) • [Node.js](https://nodejs.org/) • [OpenAI](https://openai.com/) • [MySQL](https://www.mysql.com/)

---

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

</div>

# Amazon Listing Optimizer (AI + Web Scraping + MySQL)

> **Problem Statement Solved:** AI-powered product listing optimization using scraping, LLM rewriting, SEO keyword generation, and storage.

This project is a full-stack web application that:

- Fetches product details from Amazon using an **ASIN**
- Scrapes title, bullet points, and description
- Uses **OpenAI** to generate improved content
- Displays **original vs optimized** content in the UI
- Stores optimization history in **MySQL**
- Provides a clean frontend for comparison

---

## 1. Problem Understanding

The goal is to build a system that:

1. Accepts an **ASIN** from the user  
2. Fetches original product details from Amazon  
3. Uses AI to:
   - Rewrite the title  
   - Improve or generate bullet points  
   - Rewrite the description  
   - Provide relevant SEO keywords  
4. Shows results in a **side-by-side comparison UI**  
5. Saves the optimization history in a database  
6. Includes proper documentation and architecture explanation  

This project fulfills all required criteria.

---

## 2. Assumptions & Scope

- Amazon does not offer free product APIs → **web scraping is required**
- Scraper must handle:
  - Different HTML layouts  
  - Missing bullet points  
- AI response must be **strict JSON**
- Five bullet points and five SEO keywords are always generated
- All optimization runs are stored for analytics/history
- The project is intended for **local evaluation**, not production scraping

---

## 3. High-Level Architecture
 ```text
    User
    └── React Frontend
    └── Express Backend (REST API)
    ├── Scraper Service (Puppeteer)
    ├── AI Service (OpenAI)
    └── MySQL Database
 ```
 
---

## 4. Folder Structure
 ```text
project/
│
├── backend/
│ ├── routes/
│ │ └── optimize.js
│ ├── services/
│ │ ├── scraper.js
│ │ └── ai.js
│ ├── db.js
│ ├── server.js
│ ├── package.json
│ └── .env
│
└── frontend/
├── src/
│ ├── App.jsx
│ ├── api.js
│ └── components/
├── public/
├── vite.config.js
└── package.json
 ```


---

## 5. Key Design Decisions

### 5.1 Scraper (Puppeteer)
- Extracts title, bullet points, and description  
- Includes fallback selectors for Amazon IN/US  
- Cleans and returns structured JSON  

### 5.2 AI Optimization (OpenAI)
- Rewrites:
  - Title  
  - Bullet points (or generates 5 new ones)  
  - Description  
- Suggests 5 SEO keywords  
- Returns strict JSON format  
- Handles malformed outputs safely  

### 5.3 Database Design
Uses **MySQL** with 2 tables:

- `products` — unique ASIN entries  
- `optimizations` — each optimization run with full data  

### 5.4 Frontend UI (React)
- ASIN input field  
- Side-by-side original vs optimized content  
- Loading/error handling  
- Clean minimal UI  

---

## 6. Database Schema

```sql
CREATE DATABASE amazon_optimizer;

USE amazon_optimizer;

CREATE TABLE products (
  asin VARCHAR(20) PRIMARY KEY,
  title TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE optimizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(20),
  original_title TEXT,
  original_bullets JSON,
  original_description TEXT,
  optimized_title TEXT,
  optimized_bullets JSON,
  optimized_description TEXT,
  keywords JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asin) REFERENCES products(asin) ON DELETE CASCADE
);
```
### 7. API Summary
  POST /api/optimize
  Request:
  ```text
{
  "asin": "B0XXXXXXX"
}

```
Request:
```text
{
  "original": { ... },
  "optimized": { ... }
}
```

### 8. AI Prompt Logic
1. Rewrite the title to be keyword-rich and readable.
2. Rewrite bullet points. If none exist, generate 5 new bullet points.
3. Rewrite the description to be clear and persuasive.
4. Provide 5 SEO keywords.
Return output in JSON format.

### 9. How to Run
Backend
```text
cd backend
npm install
npm start
```
Frontend
```text
cd frontend
npm install
npm run dev
```
Open in browser:
```
text
http://localhost:5173
```

## 10. How It Works (User Flow)

- Enter an ASIN  
- Backend scrapes Amazon product page  
- AI generates optimized content  
- Data is saved to MySQL  
- UI displays original vs optimized results  

---

## 11. Limitations & Future Improvements

- Scraping Amazon may require proxies for heavy usage  
- Bullet extraction depends on Amazon page layout  

Future enhancements may include:

- Multi-marketplace support  
- CSV/PDF export  
- Competitor comparison  
- Bulk ASIN upload  
- Advanced SEO analytics  

---

## 12. Conclusion

This project delivers a complete pipeline for Amazon listing enhancement:

- Web Scraping  
- AI-Based Optimization  
- Database Storage  
- Clean UI Comparison  
- Automatic Fallback for Missing Data  

A functional and practical tool for e-commerce automation and SEO-driven content improvement.







  
