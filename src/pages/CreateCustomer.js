import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lead', label: 'Lead' },
];

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  status: Yup.string().oneOf(statusOptions.map(opt => opt.value), 'Invalid status').required('Status is required'),
  totalSpend: Yup.number().min(0, 'Must be >= 0').required('Total spend is required'),
  visits: Yup.number().min(0, 'Must be >= 0').required('Visits is required'),
  lastActiveDay: Yup.date().required('Last active day is required'),
});

function CreateCustomer() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      status: 'lead',
      totalSpend: '',
      visits: '',
      lastActiveDay: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await api.post('/customers', values);
        navigate('/customers');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to create customer' });
      } finally {
        setSubmitting(false);
      }
    }
  });

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
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Customer
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  label="Status"
                >
                  {statusOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="totalSpend"
                name="totalSpend"
                label="Total Spend (INR)"
                type="number"
                value={formik.values.totalSpend}
                onChange={formik.handleChange}
                error={formik.touched.totalSpend && Boolean(formik.errors.totalSpend)}
                helperText={formik.touched.totalSpend && formik.errors.totalSpend}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="visits"
                name="visits"
                label="Visits"
                type="number"
                value={formik.values.visits}
                onChange={formik.handleChange}
                error={formik.touched.visits && Boolean(formik.errors.visits)}
                helperText={formik.touched.visits && formik.errors.visits}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="lastActiveDay"
                name="lastActiveDay"
                label="Last Active Day"
                type="date"
                value={formik.values.lastActiveDay}
                onChange={formik.handleChange}
                error={formik.touched.lastActiveDay && Boolean(formik.errors.lastActiveDay)}
                helperText={formik.touched.lastActiveDay && formik.errors.lastActiveDay}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {formik.errors.submit}
                </Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/customers')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Add Customer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateCustomer; 