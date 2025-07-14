# Personal Finance Management System

This comprehensive personal finance management system leverages modern web technologies to offer a complete solution for managing your finances. It's designed with secure user authentication as a cornerstone, ensuring your financial data remains private and protected. The system boasts robust transaction management capabilities, allowing you to easily track and categorize every income and expense, all presented through an intuitive dashboard for a clear and concise overview of your financial health.

-----

## 🚀 Tech Stack

### Backend

  * **Java 24**: The core programming language.
  * **Spring Boot 3.5.3**: The framework for building RESTful APIs.
  * **Spring Data JPA**: Simplifies database interactions.
  * **Spring Security**: Handles authentication and authorization.
  * **PostgreSQL**: The chosen database management system.
  * **Maven**: Manages project dependencies and builds.
  * **Swagger/OpenAPI**: For comprehensive API documentation.

### Frontend

  * **React 18**: The UI library for building interactive interfaces.
  * **React Router**: Manages client-side navigation.
  * **Axios**: A robust HTTP client for API requests.
  * **CSS3**: For styling the application.
  * **JavaScript**: Powers the frontend logic.
  * **Node.js**: The development environment for frontend tools.

-----

## 📋 Features

### 🔐 User Management

  * **Secure User Registration**: Includes email validation for new accounts.
  * **Login/Logout**: Features session-based authentication.
  * **Profile Editing**: Users can update their username and email.
  * **BCrypt Password Hashing**: Ensures secure storage of passwords.
  * **HttpOnly Cookie-Based Sessions**: Enhances session security.

### 💰 Transaction Management

  * **Transaction Tracking**: Users can create and view transactions on the history page.
  * **Categorization**: Transactions are categorized as either income or expenses.
  * **Real-time Balance**: Automatically calculates and displays the current balance.
  * **Filtered History**: Allows filtering of transaction history by date.
  * **Pre-seeded Categories**: Provides quick setup with predefined categories.

### 📊 Dashboard

  * **Balance Overview**: Displays the current balance at a glance.
  * **Weekly Summary**: Shows a summary of income and expenses for the week.
  * **Quick Entry**: Allows for fast transaction entry via a modal.
  * **Transaction History Display**: Integrates a view of recent transactions.
  * **Brazilian Date Formatting**: Ensures dates are displayed in the local format.

### 🔒 Security

  * **CORS Configuration**: Properly configured for secure frontend communication.
  * **Session-Based Authentication**: Manages user sessions securely.
  * **Password Hashing**: Utilizes BCrypt for robust password protection.
  * **Vulnerability Protection**: Safeguards against common web vulnerabilities.
  * **Input Validation & Sanitization**: Prevents malicious input.

-----

## 🏗️ Architecture

### Backend Architecture

The Spring Boot backend is designed with a layered architecture:

```
Client Request → Controller → Service → Repository → Database
     ↓              ↓           ↓
HTTP Layer → Business Logic → Data Access Layer
```

#### Controller Layer (`@RestController`)

  * Manages HTTP requests and responses.
  * Validates incoming request data.
  * Returns appropriate HTTP status codes.

#### Service Layer (`@Service`)

  * Contains the core business logic.
  * Performs necessary data transformations.
  * Coordinates operations with the repository layer.

#### Repository Layer (`@Repository`)

  * Handles all database operations.
  * Performs Create, Read, Update, and Delete (CRUD) operations.
  * Maps entities to database tables.

-----

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('entrada', 'saida'))
);
```

### Transactions Table

```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT REFERENCES users(id),
    category_id BIGINT REFERENCES categories(id)
);
```

-----

## 🎯 Pre-seeded Categories

### Income Categories (`entrada`)

  * Salário (Salary)
  * Bônus (Bonus)
  * Renda Extra (Extra Income)
  * Investimentos (Investments)
  * Venda de Produto (Product Sale)
  * Reembolso (Refund)
  * Presentes (Gifts)

### Expense Categories (`saida`)

  * Alimentação (Food)
  * Moradia (Housing)
  * Transporte (Transportation)
  * Saúde (Health)
  * Lazer (Entertainment)
  * Educação (Education)
  * Contas (Bills)
  * Vestuário (Clothing)
  * Impostos e Taxas (Taxes and Fees)
  * Empréstimos e Financiamentos (Loans and Financing)

-----

## 🔌 API Endpoints

### Authentication Endpoints (`/auth`)

#### POST `/auth/register`

Registers a new user account.

```json
// Request Body
{
  "username": "string",
  "email": "string",
  "password": "string"
}

// Response
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

#### POST `/auth/login`

Logs in a user with credentials and sets a session cookie.

```json
// Request Body
{
  "email": "string",
  "password": "string"
}

// Response
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

#### GET `/auth/me`

Retrieves current user information from the session.

```json
// Response
{
  "id": 1,
  "username": "string",
  "email": "string"
}
```

#### POST `/auth/logout`

Clears the session cookie, logging out the user.

```json
// Response
{
  "message": "Logout Realizado com Sucesso"
}
```

### Transaction Endpoints (`/api/transactions`)

#### GET `/api/transactions`

Retrieves all transactions for the currently logged-in user.

```json
// Response
[
  {
    "id": 1,
    "title": "string",
    "amount": 100.00,
    "dateTime": "2024-01-01T10:00:00",
    "categoryId": 1
  }
]
```

#### POST `/api/transactions`

Creates a new transaction.

```json
// Request Body
{
  "userId": 1,
  "categoryId": 1,
  "title": "string",
  "amount": 100.00,
  "dateTime": "2024-01-01T10:00:00"
}
```

#### PUT `/api/transactions/{id}`

Updates an existing transaction.

#### DELETE `/api/transactions/{id}`

Deletes a transaction by its ID.

### User Management Endpoints (`/api/user`)

#### POST `/api/user/edit`

Updates user profile information.

```json
// Request Body
{
  "username": "string",
  "email": "string"
}
```

-----

## 📚 API Documentation

The project includes automatic API documentation powered by Swagger (OpenAPI), making it easy to test and explore all available endpoints.

Once the backend is running, you can access the Swagger UI documentation at:
`http://localhost:8080/swagger-ui.html`

> **Note**: Ensure the backend server is running before attempting to access this page.

### Features

  * **Comprehensive Endpoint List**: Displays all available API endpoints.
  * **Clear HTTP Methods**: Clearly shows HTTP methods (GET, POST, PUT, DELETE).
  * **Data Formats**: Specifies input and output data formats (JSON).
  * **Interactive Testing**: Provides an easy-to-use interface for testing endpoints directly from your browser.
  * **Automatic Generation**: Documentation is automatically generated based on code annotations.

-----

## 🏗️ Project Structure

### 📂 Backend Files

```
src/
├── main/
│   ├── java/
│   │   └── com/financeapp/
│   │       ├── config/
│   │       │   └── SecurityConfig.java
│   │       ├── controller/
│   │       │   ├── AuthController.java
│   │       │   ├── TransactionController.java
│   │       │   └── UserController.java
│   │       ├── dto/
│   │       │   ├── LoginRequest.java
│   │       │   ├── RegisterRequest.java
│   │       │   ├── TransactionRequest.java
│   │       │   └── TransactionResponse.java
│   │       ├── model/
│   │       │   ├── User.java
│   │       │   ├── Category.java
│   │       │   └── Transaction.java
│   │       ├── repository/
│   │       │   ├── UserRepository.java
│   │       │   ├── CategoryRepository.java
│   │       │   └── TransactionRepository.java
│   │       ├── service/
│   │       │   ├── UserService.java
│   │       │   └── TransactionService.java
│   │       └── seed/
│   │           └── CategorySeeder.java
│   └── resources/
│       └── application.properties
```

### 📂 Frontend Files

```
src/
├── components/
│   ├── Footer.js
│   ├── Header.js
│   ├── LoginForm.js
│   └── RegisterForm.js
├── pages/
│   ├── DashboardPage.js
│   ├── HistoryPage.js
│   ├── LoginPage.js
│   ├── ProfilePage.js
│   └── RegisterPage.js
├── App.js
└── index.js
```

-----

## 🔐 Security Configuration

### Authentication

  * **Cookie-Based Session Management**: Manages user sessions using cookies.
  * **HttpOnly Cookies**: Enhances security by preventing client-side script access to session cookies.
  * **BCrypt Password Hashing**: Ensures robust password protection.
  * **CORS Enabled**: Configured to allow communication with the frontend.

### Security Rules

  * `/auth/**` endpoints are publicly accessible.
  * `/api/**` endpoints require a valid session cookie for access.
  * CSRF protection is disabled for API usage.
  * Form login and HTTP Basic authentication are disabled for this API.

-----

## 🛠️ Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

  * **Java 24** or higher
  * **Node.js 18** or higher
  * **PostgreSQL 12** or higher
  * **Maven 3.8** or higher

### Backend Setup

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Create PostgreSQL database**:

    ```sql
    CREATE DATABASE financedb;
    ```

3.  **Set Environment Variables**:

    These variables are automatically read by the `application.properties` file.

    **For Windows:**

    ```bash
    set DB_USERNAME=your_postgres_username
    set DB_PASSWORD=your_postgres_password
    ```

    **For Linux/Mac:**

    ```bash
    export DB_USERNAME=your_postgres_username
    export DB_PASSWORD=your_postgres_password
    ```

    You can either set these directly in the `application.properties` file (for testing purposes only) or define them as system environment variables through your operating system's settings or terminal.

4.  **Configure Database Integration - `application.properties`**:

    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/financedb
    spring.datasource.username=${DB_USERNAME}
    spring.datasource.password=${DB_PASSWORD}
    spring.datasource.driver-class-name=org.postgresql.Driver

    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
    ```

    > ⚠️ Make sure PostgreSQL is running and listening on port 5432.

5.  **Install dependencies and run**:

    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

    The backend will be available at `http://localhost:8080`.

### Frontend Setup

1.  **Navigate to frontend directory**:

    ```bash
    cd frontend
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Start development server**:

    ```bash
    npm start
    ```

    The frontend will be available at `http://localhost:3000`.
