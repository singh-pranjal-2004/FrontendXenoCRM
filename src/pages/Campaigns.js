import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { setCampaigns } from '../store/slices/campaignSlice';
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
  Button,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

function Campaigns() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { campaigns } = useSelector((state) => state.campaigns);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editTargetAudience, setEditTargetAudience] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCampaignId, setDeleteCampaignId] = useState(null);
  const [deleteCampaignStatus, setDeleteCampaignStatus] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const res = await api.get('/campaigns');
        dispatch(setCampaigns(res.data.campaigns || []));
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to load campaigns', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleDeliver = async (campaign) => {
    setLoadingId(campaign._id || campaign.id);
    try {
      const res = await api.post(`/campaigns/${campaign._id || campaign.id}/deliver`);
      setSnackbar({ open: true, message: `Delivery started for ${res.data.total} customers!`, severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to start delivery', severity: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleEdit = (campaign) => {
    setEditCampaign(campaign);
    setEditStartDate(campaign.schedule?.startDate ? campaign.schedule.startDate.slice(0, 10) : '');
    setEditEndDate(campaign.schedule?.endDate ? campaign.schedule.endDate.slice(0, 10) : '');
    setEditTargetAudience(campaign.targetAudience || '');
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/campaigns/${editCampaign._id || editCampaign.id}`, {
        schedule: {
          startDate: editStartDate,
          endDate: editEndDate,
          frequency: editCampaign.schedule?.frequency || 'once',
        },
        targetAudience: editTargetAudience
      });
      setEditDialogOpen(false);
      setSnackbar({ open: true, message: 'Campaign updated!', severity: 'success' });
      // Refresh campaigns
      const res = await api.get('/campaigns');
      dispatch(setCampaigns(res.data.campaigns || []));
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update campaign', severity: 'error' });
    }
  };

  const handleDelete = (campaignId, status) => {
    setDeleteCampaignId(campaignId);
    setDeleteCampaignStatus(status);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/campaigns/${deleteCampaignId}`);
      setDeleteDialogOpen(false);
      setSnackbar({ open: true, message: 'Campaign deleted!', severity: 'success' });
      // Refresh campaigns
      const res = await api.get('/campaigns');
      dispatch(setCampaigns(res.data.campaigns || []));
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete campaign', severity: 'error' });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Campaigns
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/campaign-history')}
          >
            View History
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/campaigns/create')}
          >
            Create Campaign
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Target Audience</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No campaigns found.</TableCell>
              </TableRow>
            ) : campaigns.map((campaign) => (
              <TableRow key={campaign._id || campaign.id}>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>{campaign.type}</TableCell>
                <TableCell>
                  <Chip
                    label={campaign.status}
                    color={getStatusColor(campaign.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {campaign.schedule && campaign.schedule.startDate
                    ? new Date(campaign.schedule.startDate).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {campaign.schedule && campaign.schedule.endDate
                    ? new Date(campaign.schedule.endDate).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {campaign.targetAudience || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/campaigns/${campaign._id || campaign.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 1 }}
                    onClick={() => handleDeliver(campaign)}
                    disabled={loadingId === (campaign._id || campaign.id)}
                  >
                    {loadingId === (campaign._id || campaign.id) ? 'Delivering...' : 'Deliver'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 1 }}
                    onClick={() => handleEdit(campaign)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDelete(campaign._id || campaign.id, campaign.status)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Edit Campaign Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Campaign</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={editStartDate}
            onChange={e => setEditStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            value={editEndDate}
            onChange={e => setEditEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Target Audience"
            fullWidth
            value={editTargetAudience}
            onChange={e => setEditTargetAudience(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Campaign</DialogTitle>
        <DialogContent>
          {deleteCampaignStatus !== 'draft' && (
            <Typography color="error" sx={{ mb: 2 }}>
              Warning: You are deleting a campaign that is <b>not in draft status</b>.<br />
              This action cannot be undone.
            </Typography>
          )}
          <Typography>Are you sure you want to delete this campaign?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Campaigns; 