import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers } = useSelector((state) => state.customers);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        // First try to find in Redux store
        const storeCustomer = customers.find(c => c._id === id);
        if (storeCustomer) {
          setCustomer(storeCustomer);
        } else {
          // If not in store, fetch from API
          const response = await api.get(`/customers/${id}`);
          setCustomer(response.data);
        }
      } catch (err) {
        setError('Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, customers]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
          sx={{ mt: 2 }}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Customer not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/customers')}
          sx={{ mt: 2 }}
        >
          Back to Customers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/customers')}
        sx={{ mb: 3 }}
      >
        Back to Customers
      </Button>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {`${customer.firstName} ${customer.lastName}`}
          </Typography>
          <Chip
            label={customer.status}
            color={customer.status === 'active' ? 'success' : 'default'}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {customer.email}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {customer.phone || '-'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Total Spend
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ₹{customer.totalSpend || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Visits
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {customer.visits || 0}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Last Active
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {customer.lastActiveDay ? new Date(customer.lastActiveDay).toLocaleDateString() : '-'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {new Date(customer.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default CustomerDetails; 