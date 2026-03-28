# Tabloo - Modern SaaS Authentication System

A modern, scalable SaaS application built with Next.js 16, PostgreSQL, and secure authentication featuring OTP email verification.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based with bcrypt password hashing
- 📧 **Email Verification** - OTP verification via SMTP
- 🛡️ **Protected Routes** - Middleware-based route protection
- 🗄️ **PostgreSQL Database** - Robust data storage with Supabase
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Next.js 16** - Latest features and performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase)
- SMTP email account (Gmail recommended)

### Installation

1. **Install dependencies** (Already done ✅)
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Update `.env.local` with your credentials:
   
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@db.rdyjoxkknkwdedehumcu.supabase.co:5432/postgres
   
   # JWT Secret (use a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # SMTP Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_APP_PASSWORD=your-gmail-app-password
   
   # App Configuration
   APP_NAME=Tabloo
   APP_URL=http://localhost:3000
   ```

3. **Initialize Database**
   
   First, start the development server:
   ```bash
   npm run dev
   ```
   
   Then visit: http://localhost:3000/api/init-db
   
   This will create the necessary tables:
   - `users` - User accounts
   - `otps` - OTP verification codes

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
tabloo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── signup/route.js       # User registration
│   │   │   │   ├── login/route.js        # User login
│   │   │   │   ├── verify-otp/route.js   # OTP verification
│   │   │   │   ├── resend-otp/route.js   # Resend OTP
│   │   │   │   ├── logout/route.js       # User logout
│   │   │   │   └── me/route.js           # Get current user
│   │   │   └── init-db/route.js          # Database initialization
│   │   ├── login/page.js                 # Login page
│   │   ├── signup/page.js                # Signup page
│   │   ├── verify-otp/page.js            # OTP verification page
│   │   ├── profile/page.js               # Protected profile page
│   │   ├── page.js                       # Public home page
│   │   ├── layout.js                     # Root layout
│   │   └── globals.css                   # Global styles
│   ├── contexts/
│   │   └── AuthContext.js                # Authentication context
│   ├── lib/
│   │   ├── db.js                         # Database utilities
│   │   ├── password.js                   # Password hashing
│   │   ├── jwt.js                        # JWT token handling
│   │   ├── otp.js                        # OTP generation
│   │   └── email.js                      # Email sending
│   └── middleware.js                      # Route protection
├── .env.local                            # Environment variables
└── package.json
```

## 🔑 Authentication Flow

1. **Signup**
   - User enters email, name, and password
   - System creates unverified account
   - OTP sent to email
   - User redirected to verification page

2. **OTP Verification**
   - User enters 6-digit OTP
   - OTP verified (10-minute expiration)
   - Account marked as verified
   - Welcome email sent

3. **Login**
   - User enters email and password
   - System verifies credentials
   - JWT token generated and stored in cookie
   - User redirected to profile

4. **Protected Access**
   - Middleware checks JWT token
   - Authenticated users can access protected routes
   - Unauthenticated users redirected to login

## 🛠️ API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/verify-otp` | POST | Verify OTP code |
| `/api/auth/resend-otp` | POST | Resend OTP email |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/me` | GET | Get current user |
| `/api/init-db` | GET | Initialize database (dev only) |

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Protection against XSS attacks
- **OTP Expiration**: 10-minute validity
- **Email Verification**: Required before login
- **Route Protection**: Middleware-based access control

## 📧 Email Configuration (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Create new app password for "Mail"
3. Use this password in `SMTP_APP_PASSWORD`

## 🎨 Pages

- `/` - Public home page (unprotected)
- `/signup` - User registration
- `/verify-otp` - Email verification
- `/login` - User login
- `/profile` - Protected user dashboard (requires auth)

## 🚧 Development Notes

- Database initialization route (`/api/init-db`) is only available in development
- JWT secret should be changed in production
- SMTP credentials should be stored securely
- Consider adding rate limiting for production

## 📝 Next Steps

1. Add your PostgreSQL password to `.env.local`
2. Add your email credentials to `.env.local`
3. Initialize the database by visiting `/api/init-db`
4. Test the signup flow
5. Customize the UI and add your SaaS features!

## 📄 License

MIT

---

Built with ❤️ using Next.js, PostgreSQL, and modern web technologies.
