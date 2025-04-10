'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="rounded-lg border bg-card shadow">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">General Settings</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="serverUrl" className="font-medium">
                  Server URL
                </label>
                <input
                  id="serverUrl"
                  name="serverUrl"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={settings.serverUrl}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  The URL of the DMI CLI server
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="refreshInterval" className="font-medium">
                  Refresh Interval (seconds)
                </label>
                <input
                  id="refreshInterval"
                  name="refreshInterval"
                  type="number"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={settings.refreshInterval}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  How often to refresh data from the server
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableNotifications"
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="enableNotifications" className="font-medium">
                  Enable Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableAutoSync"
                  name="enableAutoSync"
                  checked={settings.enableAutoSync}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="enableAutoSync" className="font-medium">
                  Enable Auto Sync
                </label>
              </div>
            </div>

            <div>
              <Button type="submit">
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings; 