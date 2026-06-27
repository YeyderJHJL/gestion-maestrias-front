import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EstudianteLayout } from '../../layouts/EstudianteLayout';
import { useAuth } from '../../context/AuthContext';
import { getCourse, getCourseTeachers, CourseResponse } from '../../services/coursesApiService';
import { AssignmentResponse } from '../../services/assignmentsApiService';
import { ApiError } from '../../services/api';
import { Loader2Icon, ArrowLeftIcon, FileTextIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { getFileUrl } from '../../services/filesApiService';

export function EstudianteCursoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [teachers, setTeachers] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    
    setLoading(true);
    Promise.all([
      getCourse(token, id),
      getCourseTeachers(token, id)
    ])
    .then(([courseData, teachersData]) => {
      setCourse(courseData);
      setTeachers(teachersData);
    })
    .catch(err => {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar la información del curso');
    })
    .finally(() => setLoading(false));
  }, [token, id]);

  const availableSyllabus = course?.syllabusFile || teachers.find(t => t.syllabusFile)?.syllabusFile;

  const handleDownloadSyllabus = async () => {
    if (availableSyllabus?.id && token) {
      try {
        const fileData = await getFileUrl(token, availableSyllabus.id);
        if (fileData.downloadUrl) {
          window.open(fileData.downloadUrl, '_blank');
        }
      } catch (err) {
        alert('Error al obtener el sílabo.');
      }
    } else {
      alert('El sílabo aún no está disponible para este curso.');
    }
  };

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        {/* Header con botón regresar */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/estudiante/matricula')}
            className="p-2 hover:bg-surface border border-border rounded-lg transition-colors text-text-muted"
            title="Volver a Mi Matrícula"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-serif font-bold text-text">
            Detalle del Curso
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span>Cargando detalles...</span>
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {error}
          </div>
        ) : !course ? (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            Curso no encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Info Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Info General */}
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-serif font-bold text-text mb-2">
                    {course.name}
                  </h2>
                  <p className="text-text-muted font-medium">Código: {course.code}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-text">Fecha de inicio</p>
                      <p className="text-sm text-text-muted">{course.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-text">Fecha de fin</p>
                      <p className="text-sm text-text-muted">{course.endDate}</p>
                    </div>
                  </div>
                </div>

                {course.observations && (
                  <div className="pt-4 border-t border-border mt-4">
                    <p className="text-sm font-semibold text-text mb-1">Observaciones</p>
                    <p className="text-sm text-text-muted">{course.observations}</p>
                  </div>
                )}
              </div>

              {/* Docentes Asignados */}
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-text mb-4 border-b border-border pb-2">
                  Docente(s) a cargo
                </h3>
                
                {teachers.length === 0 ? (
                  <p className="text-sm text-text-muted italic">No hay docentes asignados todavía.</p>
                ) : (
                  <ul className="space-y-4">
                    {teachers.map(teacher => (
                      <li key={teacher.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text">{teacher.teacherName}</p>
                          <p className="text-sm text-text-muted">{teacher.teacherEmail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-text mb-4 border-b border-border pb-2">
                  Recursos
                </h3>
                
                <button
                  onClick={handleDownloadSyllabus}
                  disabled={!availableSyllabus}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors shadow-sm ${
                    availableSyllabus 
                      ? 'bg-primary text-white hover:bg-primary-light'
                      : 'bg-surface-alt text-text-muted cursor-not-allowed border border-border'
                  }`}
                >
                  <FileTextIcon className="w-5 h-5" />
                  {availableSyllabus ? 'Descargar Sílabo' : 'Sílabo no disponible'}
                </button>
                
                {!availableSyllabus && (
                  <p className="text-xs text-text-muted mt-3 text-center">
                    El docente o coordinador aún no ha subido el documento para este curso.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </EstudianteLayout>
  );
}
