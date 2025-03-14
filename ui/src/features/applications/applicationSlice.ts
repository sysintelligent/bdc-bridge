import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Application {
  id: string;
  name: string;
  namespace: string;
  status: 'Healthy' | 'Degraded' | 'Progressing' | 'Suspended' | 'Unknown';
  syncStatus: 'Synced' | 'OutOfSync' | 'Unknown';
  createdAt: string;
}

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  selectedApplication: null,
  loading: false,
  error: null,
};

export const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchApplicationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectApplication: (state, action: PayloadAction<string>) => {
      state.selectedApplication = state.applications.find(app => app.id === action.payload) || null;
    },
    clearSelectedApplication: (state) => {
      state.selectedApplication = null;
    },
  },
});

export const {
  fetchApplicationsStart,
  fetchApplicationsSuccess,
  fetchApplicationsFailure,
  selectApplication,
  clearSelectedApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer; 