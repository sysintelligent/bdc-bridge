import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from '../hooks/redux';

const Applications: React.FC = () => {
  const { applications, loading } = useAppSelector((state) => state.applications);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'success';
      case 'Degraded':
        return 'error';
      case 'Progressing':
        return 'warning';
      case 'Suspended':
        return 'default';
      default:
        return 'info';
    }
  };

  const getSyncStatusColor = (syncStatus: string) => {
    switch (syncStatus) {
      case 'Synced':
        return 'success';
      case 'OutOfSync':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Applications
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Application
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading applications...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="applications table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Namespace</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Sync Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id} hover>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.namespace}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.status}
                        color={getStatusColor(app.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.syncStatus}
                        color={getSyncStatusColor(app.syncStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No applications found. Click "New Application" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Applications; 