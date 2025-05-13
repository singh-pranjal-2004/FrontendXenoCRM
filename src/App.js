import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

// Layout
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import CreateCampaign from './pages/CreateCampaign';
import AudienceSegmentBuilder from './pages/AudienceSegmentBuilder';
import CampaignHistory from './pages/CampaignHistory';
import CreateCustomer from './pages/CreateCustomer';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9800', // Orange
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6fb',
      paper: '#fff',
    },
    success: {
      main: '#43a047',
    },
    error: {
      main: '#e53935',
    },
    info: {
      main: '#0288d1',
    },
    warning: {
      main: '#fbc02d',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
          transition: 'background 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(25, 118, 210, 0.18)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: '#fff',
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetails />} />
            <Route path="customers/new" element={<CreateCustomer />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:id" element={<CampaignDetails />} />
            <Route path="campaigns/create" element={<CreateCampaign />} />
            <Route path="audience-segments" element={
              <ProtectedRoute>
                <AudienceSegmentBuilder />
              </ProtectedRoute>
            } />
            <Route path="campaign-history" element={
              <ProtectedRoute>
                <CampaignHistory />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 