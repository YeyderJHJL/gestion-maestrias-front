import React from 'react';
import { UsersIcon, BookOpenIcon, ReceiptIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardStats } from '../../../services/dashboardApiService';

interface Props {
  stats: DashboardStats;
  loading: boolean;
}

const CARDS = [
  {
    key: 'enrolledStudents' as const,
    label: 'Estudiantes matriculados',
    icon: UsersIcon,
    colorIcon: 'text-primary',
    colorBg: 'bg-primary/10',
    warning: false,
  },
  {
    key: 'activeCourses' as const,
    label: 'Cursos activos',
    icon: BookOpenIcon,
    colorIcon: 'text-green-600',
    colorBg: 'bg-green-600/10',
    warning: false,
  },
  {
    key: 'pendingVouchers' as const,
    label: 'Vouchers pendientes',
    icon: ReceiptIcon,
    colorIcon: 'text-warning',
    colorBg: 'bg-warning/10',
    warning: true,
  },
];

function Skeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-border rounded" />
          <div className="h-8 w-16 bg-border rounded" />
        </div>
        <div className="h-12 w-12 bg-border rounded-lg" />
      </div>
    </div>
  );
}

export function StatsCards({ stats, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map(c => <Skeleton key={c.key} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CARDS.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-text-muted text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-text">{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.colorBg}`}>
                <Icon className={`w-6 h-6 ${card.colorIcon}`} />
              </div>
            </div>
            {card.warning && (
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning text-white">
                  {value} pendientes
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
