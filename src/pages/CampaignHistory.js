import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button
} from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  // Move fetchCampaigns outside useEffect so it can be reused
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/campaigns');
      const campaigns = res.data.campaigns || [];
      setCampaigns(campaigns);
      // Fetch delivery stats for each campaign
      const statsObj = {};
      await Promise.all(
        campaigns.map(async (c) => {
          try {
            const statRes = await api.get(`/campaigns/${c._id}/stats`);
            statsObj[c._id] = statRes.data;
          } catch (e) {
            statsObj[c._id] = { sent: 0, failed: 0, pending: 0 };
          }
        })
      );
      setStats(statsObj);
    } catch (err) {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns(); // Initial fetch only
  }, [fetchCampaigns]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Campaign History
      </Typography>
      <Button variant="outlined" onClick={fetchCampaigns} sx={{ mb: 2 }}>
        Refresh
      </Button>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Audience Size</TableCell>
                <TableCell>Sent</TableCell>
                <TableCell>Failed</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>Stats</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">{error}</TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No campaigns found.</TableCell>
                </TableRow>
              ) : (
                campaigns.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon color="primary" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={c.metrics?.totalRecipients || 0} color="info" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={stats[c._id]?.sent ?? '-'} color="success" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={stats[c._id]?.failed ?? '-'} color="error" size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={stats[c._id]?.pending ?? '-'} color="warning" size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <LinearProgress
                          variant="determinate"
                          value={
                            c.metrics?.totalRecipients
                              ? ((stats[c._id]?.sent || 0) / c.metrics.totalRecipients) * 100
                              : 0
                          }
                          sx={{ height: 8, borderRadius: 5, mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {c.metrics?.totalRecipients
                            ? `${((((stats[c._id]?.sent || 0) / c.metrics.totalRecipients) * 100) / 10).toFixed(1)}% sent`
                            : '0% sent'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default CampaignHistory; 