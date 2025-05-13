import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [retryStats, setRetryStats] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [campaignRes, retryStatsRes] = await Promise.all([
          api.get(`/campaigns/${id}`),
          api.get(`/vendor/retry-stats/${id}`)
        ]);
        setCampaign(campaignRes.data.campaign);
        setLogs(campaignRes.data.logs);
        setRetryStats(retryStatsRes.data);
      } catch (err) {
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Typography color="error" sx={{ mt: 4 }}>{error}</Typography>;
  }
  if (!campaign) {
    return <Typography sx={{ mt: 4 }}>Campaign not found.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/campaigns')}
        sx={{ mb: 3 }}
      >
        Back to Campaigns
      </Button>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {campaign.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><b>Type:</b> {campaign.type}</Typography>
            <Typography><b>Status:</b> <Chip label={campaign.status} size="small" /></Typography>
            <Typography><b>Start Date:</b> {campaign.schedule?.startDate ? new Date(campaign.schedule.startDate).toLocaleDateString() : '-'}</Typography>
            <Typography><b>End Date:</b> {campaign.schedule?.endDate ? new Date(campaign.schedule.endDate).toLocaleDateString() : '-'}</Typography>
            <Typography><b>Target Audience:</b> {campaign.segmentationRules?.length ? 'Custom Segment' : 'All'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><b>Description:</b> {campaign.description || '-'}</Typography>
            <Typography><b>Created By:</b> {campaign.createdBy?.firstName} {campaign.createdBy?.lastName} ({campaign.createdBy?.email})</Typography>
            <Typography><b>Created At:</b> {new Date(campaign.createdAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Campaign Metrics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography><b>Total Recipients:</b> {campaign.metrics?.totalRecipients || 0}</Typography>
            <Typography><b>Delivered:</b> {campaign.metrics?.delivered || 0}</Typography>
            <Typography><b>Opened:</b> {campaign.metrics?.opened || 0}</Typography>
            <Typography><b>Clicked:</b> {campaign.metrics?.clicked || 0}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {retryStats && (
              <>
                <Typography><b>Failed Deliveries:</b> {retryStats.totalFailed}</Typography>
                <Typography><b>Retry Attempts:</b> {Object.values(retryStats.retryAttempts).reduce((a, b) => a + b, 0)}</Typography>
                <Typography><b>Max Retries Reached:</b> {retryStats.maxRetriesReached}</Typography>
                <Typography color="text.secondary" variant="body2">
                  * Retries use exponential backoff with max 3 attempts
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Delivery History</Typography>
        {logs.length === 0 ? (
          <Typography>No delivery logs found for this campaign.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Retry Attempt</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Delivery Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log._id}>
                    <TableCell>{log.customerId ? `${log.customerId.firstName} ${log.customerId.lastName}` : '-'}</TableCell>
                    <TableCell>{log.customerId?.email || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={log.status} 
                        color={
                          log.status === 'SENT' ? 'success' : 
                          log.status === 'FAILED' ? 'error' : 
                          'warning'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {log.status === 'FAILED' && retryStats?.retryAttempts[log._id] > 0 && (
                        <Chip 
                          label={`Attempt ${retryStats.retryAttempts[log._id]}`}
                          color="warning"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.deliveryTime ? new Date(log.deliveryTime).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}

export default CampaignDetails; 