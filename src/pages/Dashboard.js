import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Button, Tooltip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../services/api';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, duration / 30);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{display}</span>;
}

function getCreativeInsight(stats) {
  if (stats.customers < 10 && stats.reach < 10) {
    return (
      <>
        <b>🌱 Grow Your Impact!</b><br />
        <span>
          Your customer base is still sprouting, and your campaigns are just starting to branch out. This is the perfect time to nurture growth and maximize your marketing efforts!<br />
          <b>What to Do Next:</b><br />
          🌟 <b>Attract New Customers:</b> Launch referral programs, try targeted ads, or offer first-time incentives to bring in fresh faces.<br />
          🎯 <b>Optimize Your Campaigns:</b> Refine your messaging and targeting to make every campaign count.<br />
          🚀 <b>Track Your Progress:</b> Watch your dashboard bloom as your reach and conversions grow!<br />
          <i>Pro Tip: A thriving customer garden means more fruitful campaigns and bigger returns!</i>
        </span>
      </>
    );
  } else if (stats.customers < 10) {
    return (
      <>
        <b>🚦 Heads Up! Your Campaigns Need a Bigger Audience!</b><br />
        <span>
          Your current customer base is on the smaller side, which means your awesome campaigns aren't reaching their full potential.<br />
          <b>What can you do?</b><br />
          🚀 <b>Grow your audience:</b> Try targeted ads, launch a referral program, or kick off a lead generation campaign.<br />
          🤝 <b>Invite your customers to spread the word:</b> Reward referrals and make sharing easy.<br />
          📈 <b>Track your growth:</b> Watch your dashboard stats climb as you bring in new faces!<br />
          <i>Pro Tip: The more customers you have, the greater your campaign's impact—and the higher your ROI!</i>
        </span>
      </>
    );
  } else if (stats.campaigns === 0) {
    return (
      <>
        <b>🎯 Ready to Engage?</b><br />
        <span>
          You have a solid customer base, but no active campaigns!<br />
          <b>Action:</b> Launch a new campaign to keep your audience engaged and boost your brand presence.
        </span>
      </>
    );
  } else if (stats.reach > stats.customers * 2) {
    return (
      <>
        <b>🔥 Impressive Reach!</b><br />
        <span>
          Your campaigns are reaching far and wide!<br />
          <b>Keep up the momentum</b> by analyzing which campaigns perform best and doubling down on those strategies.
        </span>
      </>
    );
  } else {
    return (
      <>
        <b>🚀 Keep Growing!</b><br />
        <span>
          Your CRM is active and growing. Continue to experiment with new campaign ideas and audience segments for even better results!
        </span>
      </>
    );
  }
}

function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, campaigns: 0, reach: 0 });
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState('');
  const [aiInsight, setAiInsight] = useState('');

  const fetchAiInsight = async (statsObj) => {
    try {
      const res = await api.post('/ai/dashboard-insight', { stats: statsObj });
      setAiInsight(res.data.insight);
    } catch {
      setAiInsight('Unable to generate AI insight.');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [customersRes, campaignsRes] = await Promise.all([
        api.get('/customers'),
        api.get('/campaigns'),
      ]);
      const customers = customersRes.data.customers || [];
      const campaigns = campaignsRes.data.campaigns || [];
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      const reach = campaigns.reduce((sum, c) => sum + (c.metrics?.totalRecipients || 0), 0);
      const statsObj = { customers: customers.length, campaigns: activeCampaigns, reach };
      setStats(statsObj);
      setInsight(
        `You have ${activeCampaigns} active campaign${activeCampaigns !== 1 ? 's' : ''} reaching ${reach} user${reach !== 1 ? 's' : ''}.`
      );
      fetchAiInsight(statsObj);
    } catch (err) {
      setStats({ customers: 0, campaigns: 0, reach: 0 });
      setInsight('Unable to load insights.');
      setAiInsight('Unable to generate AI insight.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Customers',
      icon: <PeopleIcon fontSize="large" color="primary" />,
      color: '#1976d2',
      key: 'customers',
      value: stats.customers,
      tooltip: 'Number of customers in your CRM',
    },
    {
      label: 'Active Campaigns',
      icon: <CampaignIcon fontSize="large" color="secondary" />,
      color: '#ff9800',
      key: 'campaigns',
      value: stats.campaigns,
      tooltip: 'Number of campaigns currently active',
    },
    {
      label: 'Campaign Reach',
      icon: <TrendingUpIcon fontSize="large" color="success" />,
      color: '#43a047',
      key: 'reach',
      value: stats.reach,
      tooltip: 'Total users targeted by all campaigns',
    },
  ];

  // Filter out a specific unwanted AI insight
  const unwantedInsight = 'With only 3 customers and a campaign reach of 2, the current campaigns are reaching a limited portion of the existing customer base. Action: Investigate campaign targeting and consider broader channels or messaging to increase reach and engagement with the full customer base.';
  const aiInsightToShow = aiInsight && !aiInsight.includes(unwantedInsight) ? aiInsight : '';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
        Dashboard
      </Typography>
      <Button variant="outlined" onClick={fetchStats} sx={{ mb: 3 }} disabled={loading}>
        Refresh
      </Button>
      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} md={4} key={stat.key}>
            <Tooltip title={stat.tooltip} arrow>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: 170,
                  borderRadius: 3,
                  boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: `0 8px 32px ${stat.color}33`,
                  },
                  background: 'rgba(255,255,255,0.95)',
                }}
                elevation={4}
              >
                <Avatar sx={{ bgcolor: stat.color, mb: 1, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Typography component="h2" variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                  {stat.label}
                </Typography>
                <Typography component="p" variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                  <AnimatedNumber value={stat.value} />
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, p: 3, background: 'rgba(255,255,255,0.85)', borderRadius: 3, boxShadow: '0 2px 12px rgba(25, 118, 210, 0.08)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Creative Insight</Typography>
        <Typography variant="body1" color="text.secondary">
          {getCreativeInsight(stats)}
        </Typography>
        {aiInsightToShow && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>AI Insight</Typography>
            <Typography variant="body2" color="secondary">{aiInsightToShow}</Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard; 