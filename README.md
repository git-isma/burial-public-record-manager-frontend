# 🪦 ISMA Burial Records Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![Styled Components](https://img.shields.io/badge/Styled--Components-6.x-DB7093?logo=styled-components)

A professional, high-performance web application designed for the comprehensive management of burial records. This system streamlines the process of data capture, verification, and record retrieval with a premium user experience.

## ✨ Key Features

- **📋 Advanced Data Capture**: Intuitive multi-section forms for recording:
  - Deceased Information
  - Next of Kin Details
  - Burial Permit Data
  - Service & Payment Information
- **🔍 Robust Records Management**: 
  - Real-time search by Applicant Name, Email, or Mobile.
  - Comprehensive filtering and status tracking (Pending, Verified, Rejected).
- **📊 Interactive Dashboard**: Visual data insights using Recharts for statistics and trends.
- **📄 Document Generation**:
  - Instant PDF Receipt generation via `jspdf`.
  - Export records to Excel with `xlsx`.
- **🎨 Premium UI/UX**:
  - Modern, responsive design with Glassmorphism effects.
  - Support for custom themes and dynamic layouts.
  - Smooth micro-animations for enhanced engagement.
- **🛠️ Staff Tools**: Role-based access control for Data Entry and Administrators.

## 🚀 Tech Stack

- **Core**: React 18 & Vite
- **Styling**: Styled Components (Vanilla CSS logic)
- **State/Routing**: React Router DOM, Context API
- **Data Handling**: Axios, React Datepicker
- **Reporting**: JSPDF, JSPDF-AutoTable, SheetJS (XLSX), Html2Canvas
- **Visualization**: Recharts

## 📥 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm run prod
  ```
- **Build for Production**:
  ```bash
  npm run build:prod
  ```

## ⚙️ Configuration

The application uses environment variables for API configuration. Create `.env.dev` and `.env.prod` files:

```env
VITE_API_URL=https://your-api-endpoint.com/api
```

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Modals, DatePickers, etc.)
├── contexts/       # Toast and Settings context providers
├── pages/          # Main views: Home, DataCapture, Records
├── styles/         # Global styles and theme definitions
├── utils/          # API services and document generators
└── App.jsx         # Root routing logic
```

---

*Developed for ISMA Burial Management Services.*
