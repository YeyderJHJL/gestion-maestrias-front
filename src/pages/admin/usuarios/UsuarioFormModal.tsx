// Modal de creación y edición de usuarios.
// En modo creación muestra campos adicionales según el rol seleccionado:
//   - STUDENT: datos del estudiante (promoción, CUI, código de pago)
//   - TEACHER: datos del docente (tipo, categoría, grado académico, etc.)
// En modo edición solo permite modificar los campos base del usuario.

import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { UserRole } from '../../../types/auth';
import { User, UserRequest } from '../../../services/usersApiService';
import { Promotion } from '../../../services/studentsApiService';
import { TeacherType, TeacherCategory, AcademicDegree } from '../../../services/teachersApiService';
import { StudentFormState, TeacherFormState } from './useUsuarios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // null = modo crear, User = modo editar
  editingUser: User | null;
  // Formulario base (aplica a todos los roles)
  form: UserRequest;
  setForm: (form: UserRequest) => void;
  // Formulario adicional para estudiantes
  studentForm: StudentFormState;
  setStudentForm: (form: StudentFormState) => void;
  // Formulario adicional para docentes
  teacherForm: TeacherFormState;
  setTeacherForm: (form: TeacherFormState) => void;
  // Promociones disponibles para el select de estudiante
  promotions: Promotion[];
  loadingPromotions: boolean;
  // Estado del envío
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function UsuarioFormModal({
  isOpen,
  onClose,
  editingUser,
  form,
  setForm,
  studentForm,
  setStudentForm,
  teacherForm,
  setTeacherForm,
  promotions,
  loadingPromotions,
  submitting,
  formError,
  onSubmit,
}: Props) {
  // Clase común para los inputs del formulario
  const inputClass =
    'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      size="lg"
      accentBorder
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* ── Datos personales (comunes a todos los roles) ── */}
        <div>
          <h3 className="font-semibold text-text mb-4">Datos personales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">Nombres *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">Apellidos *</label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-text">
                Correo institucional *
              </label>
              <input
                type="email"
                required
                maxLength={255}
                placeholder="@unsa.edu.pe"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">DNI</label>
              <input
                type="text"
                maxLength={20}
                value={form.dni ?? ''}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text">Rol *</label>
              <select
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                className={inputClass}
              >
                <option value="ADMIN">Administrador</option>
                <option value="COORDINATOR">Coordinador</option>
                <option value="TEACHER">Docente</option>
                <option value="STUDENT">Estudiante</option>
              </select>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="block text-sm font-medium text-text">Estado</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="active"
                    checked={form.active}
                    onChange={() => setForm({ ...form, active: true })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="active"
                    checked={!form.active}
                    onChange={() => setForm({ ...form, active: false })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text">Inactivo</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Datos del estudiante (solo en modo crear con rol STUDENT) ── */}
        {!editingUser && form.role === 'STUDENT' && (
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-text mb-4">Datos del estudiante</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-text">Promoción *</label>
                {loadingPromotions ? (
                  <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    Cargando promociones...
                  </div>
                ) : (
                  <select
                    required
                    value={studentForm.promotionId}
                    onChange={(e) =>
                      setStudentForm({ ...studentForm, promotionId: Number(e.target.value) })
                    }
                    className={inputClass}
                  >
                    <option value="">Selecciona una promoción</option>
                    {promotions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.programName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">CUI *</label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={studentForm.cui}
                  onChange={(e) => setStudentForm({ ...studentForm, cui: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Código de pago *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={studentForm.paymentCode}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, paymentCode: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Teléfono</label>
                <input
                  type="tel"
                  maxLength={20}
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Datos del docente (solo en modo crear con rol TEACHER) ── */}
        {!editingUser && form.role === 'TEACHER' && (
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-text mb-4">Datos del docente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-text">Tipo *</label>
                <div className="flex gap-4">
                  {(['Interno', 'Externo'] as TeacherType[]).map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="teacherType"
                        checked={teacherForm.type === t}
                        onChange={() => setTeacherForm({ ...teacherForm, type: t })}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text">
                        {t === 'Interno' ? 'Interno UNSA' : 'Externo'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Categoría</label>
                <select
                  value={teacherForm.category}
                  onChange={(e) =>
                    setTeacherForm({
                      ...teacherForm,
                      category: e.target.value as TeacherCategory | '',
                    })
                  }
                  className={inputClass}
                >
                  <option value="">Sin categoría</option>
                  <option value="Principal">Principal</option>
                  <option value="Asociado">Asociado</option>
                  <option value="Auxiliar">Auxiliar</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Grado académico</label>
                <select
                  value={teacherForm.academicDegree}
                  onChange={(e) =>
                    setTeacherForm({
                      ...teacherForm,
                      academicDegree: e.target.value as AcademicDegree | '',
                    })
                  }
                  className={inputClass}
                >
                  <option value="">Sin especificar</option>
                  <option value="Magister">Magíster</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Régimen</label>
                <input
                  type="text"
                  maxLength={100}
                  value={teacherForm.regime}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, regime: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Especialidad</label>
                <input
                  type="text"
                  maxLength={255}
                  value={teacherForm.specialty}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, specialty: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text">Teléfono</label>
                <input
                  type="tel"
                  maxLength={20}
                  value={teacherForm.phone}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, phone: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              {teacherForm.type === 'Externo' && (
                <p className="col-span-2 text-sm text-text-muted italic">
                  El correo de docentes externos es generado por la OTI. El trámite puede
                  demorar hasta una semana.
                </p>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-text-muted italic">
          El correo debe pertenecer a una cuenta Google para que el usuario pueda iniciar sesión.
        </p>

        {/* Mensaje de error devuelto por el servidor */}
        {formError && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
            {formError}
          </p>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {editingUser ? 'Guardar cambios' : 'Guardar usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
