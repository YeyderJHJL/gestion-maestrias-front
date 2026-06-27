import { StatusBadge } from '../../../../components/StatusBadge';
import type { CourseResponse } from '../../../../services/coursesApiService';

interface CourseHeaderProps {
  course: CourseResponse;
  semesterLabel: string;
  teacherName: string;
}

export function CourseHeader({ course, semesterLabel, teacherName }: CourseHeaderProps) {
  return (
    <div className="bg-primary text-white rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-bold">{course.name}</h1>
            <StatusBadge variant="activo">Regular</StatusBadge>
          </div>
          <p className="text-white/90">{semesterLabel}</p>
          <p className="text-white/80 text-sm">
            {course.startDate} - {course.endDate} · {teacherName}
          </p>
        </div>
      </div>
    </div>
  );
}
