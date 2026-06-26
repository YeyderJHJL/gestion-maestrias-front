import { useParams } from 'react-router-dom';
import { DocenteLayout } from '../../../layouts/DocenteLayout';
import { Toast } from '../../../components/Toast';
import { CourseHeader } from './components/CourseHeader';
import { SyllabusTab } from './components/SyllabusTab';
import { StudentsTable } from './components/StudentsTable';
import { GradesTable } from './components/GradesTable';
import { EditGradeModal } from './components/EditGradeModal';
import { useCursoDetalle } from './hooks/useCursoDetalle';

type TabKey = 'silabo' | 'estudiantes' | 'notas';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'silabo', label: 'Sílabo' },
  { key: 'estudiantes', label: 'Estudiantes' },
  { key: 'notas', label: 'Notas' },
];

export function DocenteCursoDetalle() {
  const { id } = useParams<{ id: string }>();
  const {
    course, students, grades,
    loading, error,
    activeTab, setActiveTab,
    handleSyllabusUpload,
    syllabusUrl, loadSyllabusUrl,
    editingGrade, gradeValue, setGradeValue,
    gradeMotivo, setGradeMotivo,
    openEditGrade, closeEditGrade, handleSaveGrade, savingGrade,
    toast, setToast,
    notasRegistradas, totalEstudiantes,
  } = useCursoDetalle(id ?? '');

  if (loading) {
    return (
      <DocenteLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DocenteLayout>
    );
  }

  if (error || !course) {
    return (
      <DocenteLayout>
        <div className="bg-accent/10 border border-accent rounded-lg p-4 text-accent">
          {error || 'Curso no encontrado'}
        </div>
      </DocenteLayout>
    );
  }

  const hasSyllabus = !!course.syllabusFile;

  return (
    <DocenteLayout>
      <div className="space-y-6">
        <div className="text-sm text-text-muted">
          <span className="text-text">{course.name}</span>
        </div>

        <CourseHeader
          course={course}
          semesterLabel={`${course.startDate} - ${course.endDate}`}
          teacherName=""
        />

        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'silabo' && (
              <SyllabusTab
                hasSyllabus={hasSyllabus}
                syllabusFileName={course.syllabusFile?.originalName}
                uploading={false}
                onUpload={handleSyllabusUpload}
                onView={() => {
                  if (course.syllabusFile?.id) {
                    loadSyllabusUrl(course.syllabusFile.id);
                  }
                }}
                onReplace={() => {}}
              />
            )}

            {activeTab === 'estudiantes' && (
              <StudentsTable students={students} />
            )}

            {activeTab === 'notas' && (
              <div className="space-y-6">
                <GradesTable
                  grades={grades}
                  onEditGrade={(grade, studentName) => openEditGrade(grade, studentName)}
                />

                <div className="sticky bottom-0 bg-surface border-t border-border p-4 flex items-center justify-between">
                  <p className="text-sm text-text-muted">
                    {notasRegistradas} de {totalEstudiantes} estudiantes con nota final registrada
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditGradeModal
        editingGrade={editingGrade}
        gradeValue={gradeValue}
        gradeMotivo={gradeMotivo}
        saving={savingGrade}
        onGradeValueChange={setGradeValue}
        onGradeMotivoChange={setGradeMotivo}
        onSave={handleSaveGrade}
        onClose={closeEditGrade}
      />

      <Toast
        variant={toast.variant}
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </DocenteLayout>
  );
}
