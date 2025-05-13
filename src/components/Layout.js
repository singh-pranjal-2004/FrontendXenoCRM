import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Fade,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 240;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const customers = useSelector((state) => state.customers.customers);
  const campaigns = useSelector((state) => state.campaigns.campaigns);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', badge: null },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers', badge: customers.length },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns', badge: campaigns.length },
    { text: 'Audience Segments', icon: <CampaignIcon />, path: '/audience-segments', badge: null },
  ];

  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      borderRight: '1px solid #e3e9f7',
      transition: 'background 0.3s',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Toolbar sx={{ minHeight: 80 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48, fontWeight: 700, mr: 2, fontSize: 24 }}>
            {user?.firstName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2', lineHeight: 1 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 13 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Tooltip title={item.text} placement="right" arrow key={item.text}>
              <ListItem
                button
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  my: 1,
                  mx: 1,
                  borderRadius: 2,
                  transition: 'background 0.18s, color 0.18s',
                  background: isActive ? 'linear-gradient(90deg, #1976d2 60%, #43a047 100%)' : 'transparent',
                  color: isActive ? '#fff' : '#222',
                  boxShadow: isActive ? '0 2px 12px #1976d233' : 'none',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(90deg, #1976d2 60%, #43a047 100%)'
                      : 'rgba(25, 118, 210, 0.08)',
                    color: isActive ? '#fff' : '#1976d2',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#fff' : '#1976d2', minWidth: 40 }}>
                  {item.badge !== null ? (
                    <Badge badgeContent={item.badge} color="secondary" overlap="circular" sx={{ '& .MuiBadge-badge': { fontWeight: 700, fontSize: 13 } }}>
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ fontWeight: isActive ? 700 : 500 }} />
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          &copy; {new Date().getFullYear()} XenoCRM
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(25, 118, 210, 0.95)',
          boxShadow: '0 2px 12px #1976d233',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', color: '#fff', fontWeight: 700 }}>
              {user?.firstName?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Fade in={mobileOpen} timeout={400}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                borderRight: '1px solid #e3e9f7',
                transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
              },
            }}
          >
            {drawer}
          </Drawer>
        </Fade>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              borderRight: '1px solid #e3e9f7',
              transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 