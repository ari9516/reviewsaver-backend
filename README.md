</div><hr/><div align="center"> <strong><h1>🛡️ REVIEWSAVER</h1></strong>
  <div align="center"><h2>AUTHENTICATION + REVIEWS + RECOMMENDATIONS</h2></div>
<h1><img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen"> <img src="https://img.shields.io/badge/Version-3.0-blue"> <img src="https://img.shields.io/badge/Response-<200ms-orange"> <img src="https://img.shields.io/badge/Setup-5min-brightgreen"></h1></div>

<h2>✨ **KEY FEATURES**</h2>

### **🔐 Authentication System**
- ✅ **Email/Password Registration** with OTP verification
- ✅ **JWT Token Authentication** (stateless sessions)
- ✅ **OTP Email Verification** via Gmail SMTP
- ✅ **Password Reset Flow** (forgot/reset password)
- ✅ **Device Hash Backward Compatibility** (legacy support)

### **📝 Review Management**
- ✅ **Full CRUD** for reviews (Create, Read, Update, Delete)
- ✅ **Category Filtering** (Movies, Electronics, Restaurants, Cafes, Food)
- ✅ **Pagination** (10/25/50 per page)
- ✅ **Search Functionality** (product name search)
- ✅ **Sorting** (by date, rating, upvotes)
- ✅ **Upvote/Downvote System**

### **🤖 AI Recommendation Engine**
- ✅ **Tier 1: Enhanced Recommendations** (category-based + keyword-based for new users)
- ✅ **Tier 2: NLP-Powered Recommendations** (full text analysis for engaged users)
- ✅ **Trending Algorithm** (most upvoted reviews)
- ✅ **Collaborative Filtering** ("users who liked X also liked Y")
- ✅ **Interactive Quiz** (mood, occasion, budget-based recommendations)

### **📊 User Dashboard**
- ✅ **Personal Statistics** (total reviews, upvotes, downvotes)
- ✅ **Profile Management** (edit username, bio, location, website)
- ✅ **My Reviews Section** (paginated user reviews)
- ✅ **Recommendation Section** (AI-powered personalized suggestions)
- ✅ **Clickable Stats** (view reviews by upvotes/downvotes/recent)

---

## 🛠️ **Tech Stack**

<table>
<thead>
<tr>
<th>Backend</th>
<th>Database</th>
<th>Security</th>
<th>Frontend</th>
<th>Tools</th>
</tr>
</thead>
<tbody>
<tr>
<td>Spring Boot 3.5.11</td>
<td>PostgreSQL 17</td>
<td>Spring Security + JWT</td>
<td>React 18.3</td>
<td>Maven 3.9</td>
</tr>
<tr>
<td>Spring Data JPA</td>
<td>Hibernate 6.6</td>
<td>BCrypt</td>
<td>React Router 6.30</td>
<td>Postman/Swagger</td>
</tr>
</tbody>
</table>

---

## 🚀 **Quick Start**

### 📥 **Prerequisites**
- Java 17+
- Maven 3.8+
- PostgreSQL 15+
- Node.js 18+ (for frontend)

### 🛠️ **Backend Setup**
```bash
# Clone & Build
git clone https://github.com/ari9516/reviewsaver-backend.git
cd reviewsaver-backend/backend
mvn clean install

# Configure Database (application-prod.properties)
spring.datasource.url=jdbc:postgresql://localhost:5432/reviewdb
spring.datasource.username=postgres
spring.datasource.password=yourpassword

# Run with production profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

✅ API: http://localhost:8080
✅ Swagger: http://localhost:8080/swagger-ui.html
```

### 🎨 **Frontend Setup**
```bash
cd ../frontend-my
npm install
npm start

✅ App: http://localhost:3000
```

---

## 📡 **API Endpoints**

### **Authentication**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register with email/password |
| POST | `/api/auth/verify-email` | - | Verify OTP |
| POST | `/api/auth/login` | - | Email/password login (returns JWT) |
| POST | `/api/auth/resend-otp` | - | Resend verification OTP |
| POST | `/api/auth/forgot-password` | - | Request password reset |
| POST | `/api/auth/reset-password` | - | Reset password with token |
| POST | `/api/auth/login-device` | - | Legacy device hash login |

### **Reviews**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/paged` | - | Paginated reviews |
| GET | `/api/reviews/trending` | - | Most upvoted reviews |
| GET | `/api/reviews/search` | - | Search by product name |
| GET | `/api/reviews/category/{category}/paged` | - | Filter by category |
| POST | `/api/reviews` | JWT | Create new review |
| PUT | `/api/reviews/{id}/upvote` | JWT | Upvote review |
| PUT | `/api/reviews/{id}/downvote` | JWT | Downvote review |

### **Recommendations**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reviews/recommendations/{userId}` | - | Personalized recommendations |
| POST | `/api/reviews/track-interaction` | JWT | Track user clicks/views |

### **User**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/{userId}/stats` | - | User statistics |
| GET | `/api/reviews/user/{userId}/all` | - | User's reviews (paginated) |

---

## 🔐 **Auth Example**

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"pass123"}'

# Verify OTP
curl -X POST http://localhost:8080/api/auth/verify-email \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","otp":"123456"}'

# Login (get JWT)
curl -X POST http://localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"pass123"}'

# Protected endpoint
curl -X GET http://localhost:8080/api/reviews/trending \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 **Project Structure**

```
reviewsaver-backend/
├── backend/
│   ├── src/main/java/com/reviewsaver/backend/
│   │   ├── controller/     # REST APIs (Auth, Review, User)
│   │   ├── service/        # Business Logic (Email, Recommendation)
│   │   ├── repository/     # JPA Repos
│   │   ├── model/          # Entities (User, Review, Interaction)
│   │   ├── config/         # Security, CORS
│   │   └── util/           # JWT Utility
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-prod.properties
│   │   └── db/migration/   # Flyway migrations
│   └── pom.xml
├── frontend-my/
│   ├── src/
│   │   ├── components/     # Login, Register, Dashboard, ReviewList
│   │   ├── services/       # API integration
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## 🧪 **Testing & Deployment**

```bash
# Backend Tests
cd backend
./mvnw test

# Frontend Tests
cd ../frontend-my
npm test

# Docker Build
docker build -t reviewsaver-backend .
docker run -p 8080:8080 reviewsaver-backend

# Deploy to Render (backend) & Netlify (frontend)
```

---

## 🐛 **Troubleshooting**

| Problem | Solution |
|---------|----------|
| Port 8080 busy | `server.port=8081` in application.properties |
| DB Connection Error | Check PostgreSQL is running & credentials |
| 401 Unauthorized | Add `Authorization: Bearer <token>` header |
| Email not sending | Verify Gmail app password in Render env vars |
| Build fails | Run `./mvnw clean install` |
| OTP not received | Check spam folder or use resend-otp endpoint |

---

## 👥 **Team Credits**

<div align="center">
<table>
<tr>
<td><b>1. Rishi Raj</b><br/>24BCE10149<br/>Frontend Lead + UI/UX</td>
<td><b>2. Arnab Kumar</b><br/>24BCE11017<br/>Backend Lead + API + Database</td>
<td><b>3. Abhilash Singh</b><br/>24BCE10706<br/>Design + Testing</td>
<td><b>4. Brotodeep Pal</b><br/>24BC10477<br/>Security + Deployment</td>
</tr>
</table>
<p><strong>🌍 India | 🏫 Computer Science Engineering</strong></p>
<a href="https://github.com/ari9516/reviewsaver-backend"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white"></a>
<a href="https://authreview-reviewsaver-ari-cc660f.netlify.app"><img src="https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"></a>
<a href="https://reviewsaver-backend-api.onrender.com"><img src="https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white"></a>
</div>

<hr/>

<div align="center">
<strong>🛡️ REVIEWSAVER APPLICATION</strong><br/>
⭐ STAR IF HELPFUL ! | 📊 <a href="https://reviewsaver-backend-api.onrender.com/swagger-ui.html">SWAGGER DOCS</a><br/>
<img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen">
<img src="https://img.shields.io/badge/Version-3.0-blue">
<img src="https://img.shields.io/badge/Response-<200ms-orange">
<img src="https://img.shields.io/badge/Setup-5min-brightgreen">
</div>

