import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    serverUrl: 'http://localhost:8080',
    refreshInterval: '60',
    enableNotifications: true,
    enableAutoSync: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Save settings logic would go here
    console.log('Settings saved:', settings);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card>
        <CardHeader title="General Settings" />
        <Divider />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Server URL"
                  name="serverUrl"
                  value={settings.serverUrl}
                  onChange={handleChange}
                  margin="normal"
                  helperText="The URL of the DMI CLI server"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Refresh Interval (seconds)"
                  name="refreshInterval"
                  type="number"
                  value={settings.refreshInterval}
                  onChange={handleChange}
                  margin="normal"
                  helperText="How often to refresh data from the server"
                />
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableNotifications}
                        onChange={handleChange}
                        name="enableNotifications"
                      />
                    }
                    label="Enable Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableAutoSync}
                        onChange={handleChange}
                        name="enableAutoSync"
                      />
                    }
                    label="Enable Auto Sync"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings; 