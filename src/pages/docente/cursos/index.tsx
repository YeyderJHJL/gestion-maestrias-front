import { Link, useParams } from 'react-router-dom';
import { ShieldAlertIcon } from 'lucide-react';
import { DocenteLayout } from '../../../layouts/DocenteLayout';
import { Toast } from '../../../components/Toast';
import { CourseHeader } from './components/CourseHeader';
import { SyllabusTab } from './components/SyllabusTab';
import { StudentsTable } from './components/StudentsTable';
import { GradesTable } from './components/GradesTable';
import { EditGradeModal } from './components/EditGradeModal';
import { useCursoDetalle } from './hooks/useCursoDetalle';
import { FilePreviewModal } from '../../../components/FilePreviewModal';
import { ImportGradesModal } from '../../../components/ImportGradesModal';
import { useState } from 'react';
import { UploadIcon } from 'lucide-react';

type TabKey = 'silabo' | 'estudiantes' | 'notas';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'silabo', label: 'Sílabo' },
  { key: 'estudiantes', label: 'Estudiantes' },
  { key: 'notas', label: 'Notas' },
];

export function DocenteCursoDetalle() {
  const { id } = useParams<{ id: string }>();
  const {
    course, students,
    syllabusFile,
    mergedRows,
    loading, error, accessDenied,
    activeTab, setActiveTab,
    handleSyllabusUpload,
    editingGrade, gradeValue, setGradeValue,
    openEditGrade, openCreateGrade, closeEditGrade, handleSaveGrade, savingGrade,
    toast, setToast,
    notasRegistradas, totalEstudiantes,
  } = useCursoDetalle(id ?? '');

  const [syllabusPreviewOpen, setSyllabusPreviewOpen] = useState(false);
  const [importGradesOpen, setImportGradesOpen] = useState(false);

  if (loading) {
    return (
      <DocenteLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DocenteLayout>
    );
  }

  if (accessDenied) {
    return (
      <DocenteLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <ShieldAlertIcon className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-serif font-bold text-text mb-2">
            Acceso denegado
          </h2>
          <p className="text-sm text-text-muted max-w-md">
            No tienes asignación en este curso. Solo puedes acceder a los cursos
            que te fueron asignados por la administración.
          </p>
          <Link
            to="/docente/dashboard"
            className="mt-4 inline-flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
          >
            Volver a Mis Cursos
          </Link>
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

  const hasSyllabus = !!syllabusFile;

  return (
    <DocenteLayout>
      <div className="space-y-6">
        <Link
          to="/docente/dashboard"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
        >
          ← Mis cursos
        </Link>

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
                syllabusFileName={syllabusFile?.originalName}
                uploading={false}
                onUpload={handleSyllabusUpload}
                onView={() => setSyllabusPreviewOpen(true)}
              />
            )}

            {activeTab === 'estudiantes' && (
              <StudentsTable students={students} />
            )}

            {activeTab === 'notas' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setImportGradesOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-semibold"
                  >
                    <UploadIcon className="w-4 h-4" />
                    Importar Notas (Excel)
                  </button>
                </div>
                
                <GradesTable
                  rows={mergedRows}
                  onEditGrade={(grade, studentName) => openEditGrade(grade, studentName)}
                  onCreateGrade={(enrollment) => openCreateGrade(enrollment)}
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
        saving={savingGrade}
        onGradeValueChange={setGradeValue}
        onSave={handleSaveGrade}
        onClose={closeEditGrade}
      />

      <Toast
        variant={toast.variant}
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      <FilePreviewModal
        fileId={syllabusFile?.id ?? null}
        isOpen={syllabusPreviewOpen}
        onClose={() => setSyllabusPreviewOpen(false)}
      />
      
      <ImportGradesModal
        isOpen={importGradesOpen}
        onClose={() => setImportGradesOpen(false)}
        courseId={course?.id || ''}
        onSuccess={() => {
          // You could reload data here if needed, or window.location.reload()
          window.location.reload();
        }}
      />
    </DocenteLayout>
  );
}
