# 🎓 Datatech Test Platform

> A comprehensive online test-taking platform built with React and Appwrite, featuring role-based access, proctoring, payment integration, and analytics.

## 📋 Overview

Datatech is an advanced test management system designed for educational institutions. It supports three user roles:
- **Admin**: Manage colleges, tests, scholarships, and payments
- **College**: Register students and monitor their performance
- **Student**: Take tests with proctoring and view results

## ✨ Key Features

### 👨‍💼 Admin Features
- View and manage all colleges
- Edit test questions and answers
- Set scholarship percentages per college
- Track student payments and payment status
- Create student groups (boxes) for test organization
- View comprehensive analytics and marks

### 🏫 College Features
- Register students with unique IDs
- Generate 6-digit unique college IDs
- View all registered students
- Monitor student test performance

### 👨‍🎓 Student Features
- Take tests with camera proctoring (visual only)
- View available tests and attempt history
- Pay for tests via Razorpay (if not scholarship eligible)
- View detailed results after test completion
- Email OTP verification for authentication

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios
- React Webcam (proctoring)
- Lucide React (icons)
- React Hot Toast (notifications)

**Backend:**
- Appwrite (Database, Auth, Storage, Functions)
- Razorpay (Payment Gateway)

## 📁 Project Structure

```
Datatech_testaker/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── config/       # Configuration
│   │   └── utils/        # Utility functions
│   └── public/
├── appwrite-functions/    # Serverless functions
├── test-data/            # Test JSON files
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Appwrite Cloud account or self-hosted instance
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Arpit8789/Datatech_testaker.git
cd Datatech_testaker
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your Appwrite and Razorpay credentials:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

4. **Start development server**
```bash
npm run dev
```

## 📚 Documentation

- [Appwrite Setup Guide](docs/APPWRITE_SETUP.md) - Database collections and attributes
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to Netlify
- [Razorpay Integration](docs/RAZORPAY_INTEGRATION.md) - Payment setup
- [API Reference](docs/API_ENDPOINTS.md) - Appwrite endpoints

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_APPWRITE_ENDPOINT` | Appwrite API endpoint |
| `VITE_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `VITE_APPWRITE_DATABASE_ID` | Database ID |
| `VITE_APPWRITE_COLLECTIONS_*` | Collection IDs |
| `VITE_APPWRITE_BUCKET_ID` | Storage bucket ID |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key |

## 💳 Payment Flow

1. Student completes test
2. System checks scholarship eligibility
3. If not eligible, "Pay Now" button appears
4. Razorpay checkout initiated
5. Payment verified via Appwrite Function
6. Payment status updated in database
7. Admin can view paid/unpaid students

## 🎥 Proctoring

- Camera feed visible during test (creates deterrent effect)
- No recording or screenshot capture
- Lightweight and privacy-friendly approach

## 📊 Database Schema

### Collections:
- **colleges** - College information and settings
- **students** - Student profiles and credentials
- **tests** - Test metadata and configurations
- **attempts** - Test attempt records
- **payments** - Payment transactions and tracking
- **groups** - Student groups for test assignment

Detailed schema available in [APPWRITE_SETUP.md](docs/APPWRITE_SETUP.md)

## 🚀 Deployment

### Frontend (Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Netlify
```

### Backend (Appwrite)
- Deploy Appwrite Functions for payment verification
- Configure environment variables in Appwrite Console

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Author

**Arpit Anand**
- GitHub: [@Arpit8789](https://github.com/Arpit8789)
- Email: Arpitanand2611@gmail.com

## 🙏 Acknowledgments

- Appwrite for backend infrastructure
- Razorpay for payment processing
- React and Vite communities

---

**Made with ❤️ by Arpit Anand**