import { apiFetch } from './api';

export interface AssignmentRequest {
  courseId: string;
  teacherId: string;
  semesterId: number;
  assignmentDate: string;
}

export interface AssignmentResponse {
  id: number;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  semesterId: number;
  semesterYear: number;
  semesterCode: string;
  assignmentDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listAssignments(token: string): Promise<AssignmentResponse[]> {
  const res = await apiFetch<ApiResponse<AssignmentResponse[]>>('/v1/assignments', token);
  return res.data;
}

export async function createAssignment(
  token: string,
  request: AssignmentRequest
): Promise<AssignmentResponse> {
  const res = await apiFetch<ApiResponse<AssignmentResponse>>('/v1/assignments', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateAssignment(
  token: string,
  courseId: string,
  teacherId: string,
  semesterId: number,
  request: AssignmentRequest
): Promise<AssignmentResponse> {
  const res = await apiFetch<ApiResponse<AssignmentResponse>>(
    `/v1/assignments/courses/${courseId}/teachers/${teacherId}/semesters/${semesterId}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  );
  return res.data;
}

export async function deleteAssignment(
  token: string,
  courseId: string,
  teacherId: string,
  semesterId: number
): Promise<void> {
  await apiFetch<void>(
    `/v1/assignments/courses/${courseId}/teachers/${teacherId}/semesters/${semesterId}`,
    token,
    {
      method: 'DELETE',
    }
  );
}
