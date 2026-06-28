import { StatusBadge } from '../../../../components/StatusBadge';
import { WelcomeBanner } from '../../../../components/WelcomeBanner';
import type { CourseResponse } from '../../../../services/coursesApiService';

interface CourseHeaderProps {
  course: CourseResponse;
  semesterLabel: string;
  teacherName: string;
}

export function CourseHeader({ course, semesterLabel, teacherName }: CourseHeaderProps) {
  return (
    <WelcomeBanner title={course.name} subtitle={semesterLabel}>
      <div className="flex items-center gap-3 mt-1">
        <StatusBadge variant="activo">Regular</StatusBadge>
      </div>
      <p className="text-white/80 text-sm mt-1">
        {course.startDate} - {course.endDate} · {teacherName}
      </p>
    </WelcomeBanner>
  );
}
