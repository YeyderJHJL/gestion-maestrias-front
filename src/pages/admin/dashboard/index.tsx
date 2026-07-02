import { motion } from 'framer-motion';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from './hooks/useDashboard';
import { StatsCards } from './components/stats/StatsCards';
import { RecentActivity } from './components/activity/RecentActivity';

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
        <WelcomeBanner
          title={`${greeting}, ${userName}`}
          subtitle={currentDate}
        />

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
