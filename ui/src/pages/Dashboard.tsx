import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { useAppSelector } from '../hooks/redux';

const Dashboard: React.FC = () => {
  const { applications } = useAppSelector((state) => state.applications);

  // Calculate summary statistics
  const totalApps = applications.length;
  const healthyApps = applications.filter((app) => app.status === 'Healthy').length;
  const syncedApps = applications.filter((app) => app.syncStatus === 'Synced').length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Total Applications</Typography>
            <Typography variant="h3">{totalApps}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Healthy</Typography>
            <Typography variant="h3">{healthyApps}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Synced</Typography>
            <Typography variant="h3">{syncedApps}</Typography>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <Typography variant="body1">
                No recent activity to display. Activity will appear here as you interact with your applications.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 