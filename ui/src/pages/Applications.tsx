import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAppSelector } from '../hooks/redux';

const Applications: React.FC = () => {
  const { applications, loading } = useAppSelector((state) => state.applications);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Degraded':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Progressing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Suspended':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getSyncStatusColor = (syncStatus: string) => {
    switch (syncStatus) {
      case 'Synced':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'OutOfSync':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Application
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading applications...</div>
      ) : (
        <div className="border rounded-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Name</th>
                  <th className="p-3 text-left font-medium">Namespace</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Sync Status</th>
                  <th className="p-3 text-left font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{app.name}</td>
                      <td className="p-3">{app.namespace}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSyncStatusColor(app.syncStatus)}`}>
                          {app.syncStatus}
                        </span>
                      </td>
                      <td className="p-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      No applications found. Click "New Application" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications; 