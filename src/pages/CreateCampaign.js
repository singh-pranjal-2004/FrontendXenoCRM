import React, { useState } from 'react';
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
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'paused', label: 'Paused' },
];

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Campaign name is required')
    .min(3, 'Campaign name must be at least 3 characters'),
  type: Yup.string()
    .required('Campaign type is required'),
  targetAudience: Yup.string()
    .required('Target audience is required'),
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date must be in the future'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  status: Yup.string()
    .oneOf(statusOptions.map(opt => opt.value), 'Invalid status')
    .required('Status is required'),
});

function CreateCampaign() {
  const navigate = useNavigate();

  // AI Message Suggestion State
  const [objective, setObjective] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      targetAudience: '',
      startDate: '',
      endDate: '',
      status: 'draft',
      message: '', // Add message field for campaign content
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await api.post('/campaigns', values);
        navigate('/campaigns');
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to create campaign' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  // AI Suggestion Handler
  const handleSuggestMessages = async () => {
    setSuggestLoading(true);
    setSuggestError('');
    setSuggestions([]);
    try {
      const res = await api.post('/ai/message-suggestions', {
        objective,
        audienceDescription: formik.values.targetAudience
      });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      setSuggestError(err.response?.data?.error || 'Failed to get suggestions.');
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/campaigns')}
        sx={{ mb: 3 }}
      >
        Back to Campaigns
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Campaign
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Campaign Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="type-label">Campaign Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  label="Campaign Type"
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                  <MenuItem value="push">Push Notification</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="audience-label">Target Audience</InputLabel>
                <Select
                  labelId="audience-label"
                  id="targetAudience"
                  name="targetAudience"
                  value={formik.values.targetAudience}
                  onChange={formik.handleChange}
                  error={formik.touched.targetAudience && Boolean(formik.errors.targetAudience)}
                  label="Target Audience"
                >
                  <MenuItem value="all">All Customers</MenuItem>
                  <MenuItem value="active">Active Customers</MenuItem>
                  <MenuItem value="inactive">Inactive Customers</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate && formik.errors.startDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
                InputLabelProps={{
                  shrink: true,
                }}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Campaign Objective (for AI Suggestions)"
                value={objective}
                onChange={e => setObjective(e.target.value)}
                placeholder="E.g. Bring back inactive users"
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleSuggestMessages}
                disabled={!objective || suggestLoading}
                sx={{ mb: 2 }}
              >
                {suggestLoading ? 'Suggesting...' : 'Suggest Messages'}
              </Button>
              {suggestError && <Typography color="error">{suggestError}</Typography>}
              {suggestions.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">AI Suggestions:</Typography>
                  {suggestions.map((msg, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => formik.setFieldValue('message', msg)}
                      >
                        Use
                      </Button>
                      <Typography variant="body2">{msg}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="message"
                name="message"
                label="Campaign Message"
                value={formik.values.message}
                onChange={formik.handleChange}
                multiline
                minRows={3}
                placeholder="Enter or select a message for your campaign"
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
                  onClick={() => navigate('/campaigns')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={formik.isSubmitting}
                >
                  Create Campaign
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateCampaign; 