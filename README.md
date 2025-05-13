# 🎨 XenoCRM Frontend

Welcome to the frontend of **XenoCRM** – a beautiful, interactive, and AI-powered campaign management interface!

## 🌟 Features

- **Interactive Dashboard** with real-time stats and AI insights
- **Campaign Management** with drag-and-drop rule builder
- **Campaign History** with detailed statistics and progress tracking
- **Customer Management** with search and filter capabilities
- **Responsive Design** that works on all devices
- **Dark/Light Mode** support
- **Creative UI Elements** including animations and tooltips

## 🛠️ Tech Stack

- React.js
- Material-UI (MUI)
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization

## 🚦 Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Configure the following variables:
     ```
     REACT_APP_API_URL=http://localhost:5000
     REACT_APP_WS_URL=ws://localhost:5000
     ```

3. **Run the development server:**
   ```bash
   npm start
   ```

## 📦 Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── redux/       # Redux store and slices
│   ├── services/    # API services
│   ├── utils/       # Helper functions
│   ├── hooks/       # Custom hooks
│   └── styles/      # Global styles
└── package.json
```

## 🎯 Key Components

### Dashboard
- Real-time statistics
- AI-powered insights
- Interactive charts
- Campaign overview

### Campaign Management
- Campaign creation form
- Rule builder
- Audience preview
- Message template editor

### Campaign History
- Campaign list
- Detailed statistics
- Progress tracking
- Manual refresh button

### Customer Management
- Customer list
- Search and filters
- Customer details
- Order history

## 🎨 UI Components

### Common Components
- `Button` - Custom styled buttons
- `Card` - Content containers
- `Table` - Data tables
- `Modal` - Popup dialogs
- `Tooltip` - Information tooltips

### Special Components
- `RuleBuilder` - Drag-and-drop rule creation
- `StatsCard` - Animated statistics
- `InsightCard` - AI-powered insights
- `ProgressBar` - Campaign progress
- `Chart` - Data visualization

## 🔄 State Management

- Redux Toolkit for global state
- Local state with React hooks
- API state management with RTK Query

## 🎭 Theming

- Material-UI theme customization
- Dark/Light mode support
- Custom color palette
- Responsive typography

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🚀 Building for Production

1. Create production build:
   ```bash
   npm run build
   ```

2. Test the production build:
   ```bash
   npm run serve
   ```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for all devices
- Responsive tables and charts
- Touch-friendly interactions

## 🎯 Performance Optimization

- Code splitting
- Lazy loading
- Memoization
- Image optimization
- Bundle size optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - feel free to use this project for your own purposes!

---

> **Ready to create beautiful campaign interfaces? Start exploring the components!**
