import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { listMyAssignments } from '../../../../services/assignmentsApiService';
import type { AssignmentResponse } from '../../../../services/assignmentsApiService';

export function useDashboard() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    listMyAssignments(token)
      .then(setAssignments)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar cursos'))
      .finally(() => setLoading(false));
  }, [token]);

  return { assignments, loading, error };
}
