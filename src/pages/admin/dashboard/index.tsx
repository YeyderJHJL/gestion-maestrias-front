import React from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from './useDashboard';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';

export function AdminDashboard() {
  const { user } = useAuth();
  const { stats, activity, loading } = useDashboard();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Buenos días' :
    currentHour < 19 ? 'Buenas tardes' :
    'Buenas noches';

  const currentDate = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Admin Principal';

  return (
    <AdminLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-serif font-bold text-text">
            {greeting}, {userName}
          </h1>
          <p className="text-text-muted capitalize">{currentDate}</p>
        </motion.div>

        <StatsCards stats={stats} loading={loading} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentActivity activity={activity} />
        </motion.div>
      </div>
    </AdminLayout>
  );
}
