import React, { useState } from 'react';
import api from '../services/api';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const fields = [
  { value: 'spend', label: 'Total Spend (INR)' },
  { value: 'visits', label: 'Visits' },
  { value: 'inactiveDays', label: 'Inactive for (days)' },
  { value: 'status', label: 'Status' },
];
const operators = [
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '==', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
];
const statusValueOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lead', label: 'Lead' },
];

function AudienceSegmentBuilder() {
  const [rules, setRules] = useState([
    { field: 'spend', operator: '>', value: 1000 },
  ]);
  const [logic, setLogic] = useState('AND');
  const [audienceSize, setAudienceSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [audienceName, setAudienceName] = useState('');

  const handleRuleChange = (idx, key, val) => {
    setRules(rules => rules.map((r, i) => i === idx ? { ...r, [key]: val } : r));
    // Reset audience size when rules change
    setAudienceSize(null);
  };
  const handleDeleteRule = idx => {
    setRules(rules => rules.filter((_, i) => i !== idx));
    setAudienceSize(null);
  };
  const handleAddRule = () => {
    setRules(rules => [...rules, { field: 'spend', operator: '>', value: 0 }]);
    setAudienceSize(null);
  };

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    setAudienceSize(null);
    try {
      const res = await api.post('/audience-segments/preview', { rules, logic });
      setAudienceSize(res.data.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audience size');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSuccessMessage(null);
    try {
      await api.post('/audience-segments', {
        name: segmentName.trim(),
        rules,
        logic,
        startDate,
        endDate,
        targetAudience
      });
      setSuccessMessage('Segment and campaign created successfully!');
      setSaving(false);
      setSaveDialogOpen(false);
      setTimeout(() => {
        navigate('/campaign-history');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save segment';
      setSaveError(msg);
      setSaving(false);
    }
  };

  // Drag-and-drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(rules);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setRules(reordered);
    setAudienceSize(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Define Audience Segment
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label="Logic"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
          <Select
            value={logic}
            onChange={e => {
              setLogic(e.target.value);
              setAudienceSize(null);
            }}
            size="small"
            sx={{ minWidth: 80 }}
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </Select>
        </Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="rules-droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {rules.map((rule, idx) => (
                  <Draggable key={idx} draggableId={`rule-${idx}`} index={idx}>
                    {(provided, snapshot) => (
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 1, p: 2, borderRadius: 2, boxShadow: 2, background: snapshot.isDragging ? '#e3f2fd' : '#f5f5f5', transition: 'background 0.2s' }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Grid item xs={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Field</InputLabel>
                            <Select
                              value={rule.field}
                              label="Field"
                              onChange={e => handleRuleChange(idx, 'field', e.target.value)}
                            >
                              {fields.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Operator</InputLabel>
                            <Select
                              value={rule.operator}
                              label="Operator"
                              onChange={e => handleRuleChange(idx, 'operator', e.target.value)}
                            >
                              {operators.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          {rule.field === 'status' ? (
                            <FormControl fullWidth size="small">
                              <InputLabel>Status Value</InputLabel>
                              <Select
                                value={rule.value}
                                label="Status Value"
                                onChange={e => handleRuleChange(idx, 'value', e.target.value)}
                              >
                                {statusValueOptions.map(opt => (
                                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              label="Value"
                              type={rule.field === 'inactiveDays' ? 'number' : 'text'}
                              value={rule.value}
                              onChange={e => handleRuleChange(idx, 'value', e.target.value)}
                              InputProps={{
                                startAdornment: rule.field === 'spend' ? '₹' : null,
                                endAdornment: rule.field === 'inactiveDays' ? 'days' : null
                              }}
                            />
                          )}
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            color="error"
                            onClick={() => handleDeleteRule(idx)}
                            startIcon={<DeleteIcon />}
                            disabled={rules.length === 1}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddRule}
          sx={{ mt: 1 }}
          variant="outlined"
        >
          Add Rule
        </Button>
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handlePreview} 
            disabled={loading || rules.some(r => !r.value)}
          >
            Preview Audience Size
          </Button>
          {loading && <CircularProgress size={24} />}
          {audienceSize !== null && !loading && (
            <Chip 
              label={`Audience Size: ${audienceSize} customers`} 
              color={audienceSize > 0 ? "success" : "error"} 
            />
          )}
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Paper>

      {audienceSize !== null && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Audience Size</Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>{audienceSize}</Typography>
        </Paper>
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2 }}
        onClick={() => setSaveDialogOpen(true)}
        disabled={audienceSize === 0 || audienceSize === null}
      >
        Save Segment & Create Campaign
      </Button>
      {audienceSize === 0 && (
        <Typography color="error" sx={{ mt: 1 }}>
          No customers match this segment. Please adjust your rules.
        </Typography>
      )}
      {successMessage && (
        <Typography color="success" sx={{ mt: 1 }}>
          {successMessage}
        </Typography>
      )}

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Audience Segment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Segment Name"
            fullWidth
            value={segmentName}
            onChange={e => setSegmentName(e.target.value)}
            disabled={saving}
            helperText="This will also create a campaign targeting this segment"
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={saving}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={saving}
          />
          <TextField
            margin="dense"
            label="Target Audience"
            fullWidth
            value={targetAudience}
            onChange={e => setTargetAudience(e.target.value)}
            disabled={saving}
          />
          {saveError && <Typography color="error" sx={{ mt: 1 }}>{saveError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} disabled={saving}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={saving || !segmentName.trim()}
          >
            {saving ? 'Saving...' : 'Save & Create Campaign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AudienceSegmentBuilder; 