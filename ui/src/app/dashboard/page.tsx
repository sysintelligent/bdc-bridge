'use client'

import React from 'react';
import { useAppSelector } from '@/hooks/redux';

export default function DashboardPage() {
  const { applications } = useAppSelector((state) => state.applications);

  // Calculate summary statistics
  const totalApps = applications.length;
  const healthyApps = applications.filter((app) => app.status === 'Healthy').length;
  const syncedApps = applications.filter((app) => app.syncStatus === 'Synced').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Summary Cards */}
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="text-lg font-medium">Total Applications</h3>
          <p className="text-3xl font-bold">{totalApps}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="text-lg font-medium">Healthy</h3>
          <p className="text-3xl font-bold">{healthyApps}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-4 shadow">
          <h3 className="text-lg font-medium">Synced</h3>
          <p className="text-3xl font-bold">{syncedApps}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card shadow">
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="p-4">
          <p>
            No recent activity to display. Activity will appear here as you interact with your applications.
          </p>
        </div>
      </div>
    </div>
  );
} 