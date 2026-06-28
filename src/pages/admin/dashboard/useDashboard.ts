import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ActivityItem, DashboardStats } from '../../../services/dashboardApiService';


import { listStudents } from '../../../services/studentsApiService';
import { listCourses } from '../../../services/coursesApiService';
import { listVouchers } from '../../../services/vouchersApiService';
import { listAssignments } from '../../../services/assignmentsApiService';
import { listGrades } from '../../../services/gradesApiService';

export function useDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    enrolledStudents: 0,
    activeCourses: 0,
    pendingVouchers: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, coursesRes, vouchersRes, assignmentsRes, gradesRes] = await Promise.allSettled([
        listStudents(token),
        listCourses(token),
        listVouchers(token),
        listAssignments(token),
        listGrades(token)
      ]);

      const students = studentsRes.status === 'fulfilled' ? studentsRes.value : [];
      const courses = coursesRes.status === 'fulfilled' ? coursesRes.value : [];
      const vouchers = vouchersRes.status === 'fulfilled' ? vouchersRes.value : [];
      const assignments = assignmentsRes.status === 'fulfilled' ? assignmentsRes.value : [];
      const grades = gradesRes.status === 'fulfilled' ? gradesRes.value : [];

      // Calculate Stats
      const newStats: DashboardStats = {
        enrolledStudents: students.length, // O podríamos filtrar por estado si existiera
        activeCourses: courses.length,
        pendingVouchers: vouchers.filter(v => v.stateCode === 'UPLOADED').length,
      };

      setStats(newStats);

      // Build Recent Activity
      const voucherItems: ActivityItem[] = vouchers.map(v => ({
        type: 'voucher',
        description: v.paymentConcept ? `Voucher - ${v.paymentConcept}` : 'Voucher subido',
        actor: v.studentName,
        timestamp: v.createdAt,
      }));

      const silaboItems: ActivityItem[] = assignments
        .filter(a => a.syllabusFile)
        .map(a => ({
          type: 'silabo',
          description: `Sílabo de ${a.courseName}`,
          actor: a.teacherName,
          timestamp: a.syllabusFile!.createdAt,
        }));

      const gradeItems: ActivityItem[] = grades.map(g => ({
        type: 'nota',
        description: `Nota registrada — ${g.courseName}`,
        actor: g.studentEmail,
        timestamp: g.createdAt,
      }));

      const allActivity = [...voucherItems, ...silaboItems, ...gradeItems]
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 10);

      setActivity(allActivity);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [load]);

  return {
    stats,
    activity,
    loading,
    error,
    reload: load,
  };
}
