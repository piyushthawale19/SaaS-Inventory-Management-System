# StockFlow - SaaS Inventory Management System

StockFlow is a modern, full-stack SaaS Inventory Management System designed to help businesses track stock levels, manage products, and monitor inventory value in real-time.

## 🚀 Features

- **📊 Comprehensive Dashboard**: Real-time stats for out-of-stock items, low-stock alerts, and total inventory value.
- **📦 Inventory Management**: Full CRUD operations for products including SKU, category, and pricing.
- **⚡ Quick Stock Adjustments**: Increment or decrement stock levels directly from the inventory table.
- **🔍 Advanced Search**: Animated, elastic search bar for quick access to products and SKUs.
- **⚠️ Smart Alerts**: Automatic identification of low-stock items based on customizable thresholds.
- **📄 Pagination**: Smooth navigation through large inventory datasets.
- **🔐 Secure Architecture**: Backend powered by Node.js, Express, and Prisma with JWT-based authentication.
- **🎨 Premium UI**: Beautifully crafted with Next.js 14, Tailwind CSS, and Lucide icons.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (Default) / PostgreSQL compatible
- **Authentication**: JWT & Bcrypt

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/piyushthawale19/SaaS-Inventory-Management-System.git
   cd SaaS-Inventory-Management-System
   ```

2. **Run the setup script**:
   This will install dependencies for the root, client, and server.
   ```bash
   npm run setup
   ```

3. **Configure Environment Variables**:
   Update the `.env` file in the `server/` directory with your database connection and JWT secret.

4. **Initialize Database**:
   ```bash
   cd server
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Running the App

You can run both the frontend and backend concurrently from the root directory:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```text
├── frontend/           # Next.js 14 client application
├── server/             # Express.js backend & Prisma schema
├── package.json        # Root scripts for concurrent development
└── README.md           # Project documentation
```

## 📄 License

This project is licensed under the PIYUSH THAWALE License.
