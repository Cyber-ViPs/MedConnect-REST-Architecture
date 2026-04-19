#<img width="1460" height="832" alt="Screenshot_20260419_121048" src="https://github.com/user-attachments/assets/4fece236-5c3d-4dc5-a57e-58eca2be0c2e" />
#  User Management API 🐻🚀

A robust and scalable RESTful API built with Node.js, designed to manage users and their addresses with built-in security, role-based access control (RBAC), and automated database orchestration.

## 🛠 Technologies & Tools

- **Backend:** Node.js (ES Modules)
- **Framework:** Express.js
- **ORM:** Sequelize (PostgreSQL)
- **Database:** PostgreSQL
- **Environment:** Docker & Docker Compose
- **Security:** JWT (JSON Web Tokens) & Bcrypt.js
- **Validation:** Sequelize Validators & Custom Middlewares

## 🚀 Key Features

- **Authentication & Authorization:** Secure login with JWT and role-restricted routes (Admin, User, etc.).
- **Database Transactions:** Ensures data integrity when creating users and addresses simultaneously.
- **Soft Delete:** Uses Sequelize `paranoid` mode to recover or permanently delete records.
- **Pagination:** Scalable data fetching with `limit` and `page` parameters.
- **Automated Workflow:** Automatic migrations and database seeding on startup.
- **Clean Architecture:** Standardized error handling and professional folder structure.

---

## ⚙️ Installation & Setup

Follow these steps to get your development environment running:

### 1. Clone the Repository

    
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name

### 2. Configure Environment Variables
Copy the example environment file and adjust the values if necessary:

    cp .env.example .env

Note: Make sure to define a secure JWT_SECRET and correct database credentials inside the .env file.


### 3. Build and Run with Docker
The easiest way to start the project is using Docker Compose:

    docker-compose up -d --build

This command will:

Spin up the PostgreSQL database.

    Build the Node.js API container.

    Automatically run Migrations and Seeds (Admin user creation).

### 4. Verify Database (Optional)
To check if the Admin user was created successfully:

    docker exec -it api-container npx sequelize-cli db:seed:all

##📡 API Endpoints (Quick Look)

Method,Endpoint,Description,Access
POST,/login,Authenticate user & get token,Public
GET,/users/all,List all users (with pagination),Admin Only
POST,/users,Create new user & address,Public
PUT,/users/:id,Update user profile,Owner / Admin
DELETE,/users/:id,Soft delete user,Owner / Admin

##🧪 Testing the API

Use Postman or Insomnia.

Set the Authorization header as Bearer <your_token>.

Try fetching users with pagination: GET /users/all?page=1&limit=10&include=addresses.


🤝 Contributing

Fork the project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.




