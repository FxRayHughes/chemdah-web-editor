import { useEffect } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import { useApiStore } from './store/useApiStore';

export default function App() {
  const loadApiData = useApiStore((state) => state.loadApiData);

  useEffect(() => {
    loadApiData();
  }, [loadApiData]);

  return <DashboardLayout />;
}
