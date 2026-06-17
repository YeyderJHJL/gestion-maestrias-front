// Modal de creación y edición de usuarios.
// Muestra un subformulario adicional según el rol seleccionado:
//   - Estudiante: datos del estudiante (promoción, CUI, código de pago, estado)
//   - Docente: datos del docente (tipo, categoría, grado académico, etc.)
// En modo edición los campos del subformulario se precargan desde el objeto usuario
// y permanecen editables (a diferencia de la creación, donde son obligatorios).

import { Loader2Icon } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { UserRole } from '../../../types/auth';
import { User, UserRequest } from '../../../services/usersApiService';
import { TeacherCategory, AcademicDegree } from '../../../services/teachersApiService';
import { StudentFormState, TeacherFormState } from './useUsuarios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingUser: User | null;
  form: UserRequest;
  setForm: (form: UserRequest) => void;
  studentForm: StudentFormState;
  setStudentForm: (form: StudentFormState) => void;
  teacherForm: TeacherFormState;
  setTeacherForm: (form: TeacherFormState) => void;
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

// Clase base reutilizada en todos los inputs y selects
const inputClass =
  'w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors';

// Estilo de las opciones tipo pill para los radios (Activo/Inactivo, Interno/Externo)
function RadioPill({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer text-sm font-medium transition-all select-none ${
        checked
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-text-muted hover:border-primary/40 hover:text-text'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

// Encabezado de sección con línea separadora
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-sm font-semibold text-text uppercase tracking-wide whitespace-nowrap">
        {title}
      </h3>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
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
  submitting,
  formError,
  onSubmit,
}: Props) {
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
        <div className="space-y-4">
          <SectionHeader title="Datos personales" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">Nombres *</label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Ej: Juan Carlos"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">Apellidos *</label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Ej: Pérez López"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-text">
                Correo institucional *
              </label>
              <input
                type="email"
                required
                maxLength={255}
                placeholder="usuario@unsa.edu.pe"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">DNI</label>
              <input
                type="text"
                maxLength={20}
                placeholder="Ej: 12345678"
                value={form.dni ?? ''}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text">Rol *</label>
              <select
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                className={inputClass}
              >
                <option value="Administrador">Administrador</option>
                <option value="Coordinador">Coordinador</option>
                <option value="Docente">Docente</option>
                <option value="Estudiante">Estudiante</option>
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="block text-sm font-medium text-text">Estado</label>
              <div className="flex gap-2">
                <RadioPill
                  name="active"
                  value="true"
                  checked={form.active}
                  onChange={() => setForm({ ...form, active: true })}
                  label="Activo"
                />
                <RadioPill
                  name="active"
                  value="false"
                  checked={!form.active}
                  onChange={() => setForm({ ...form, active: false })}
                  label="Inactivo"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Datos del estudiante (cuando el rol es Estudiante) ── */}
        {form.role === 'Estudiante' && (
          <div className="space-y-4">
            <SectionHeader title="Datos del estudiante" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">
                  Año de promoción {!editingUser && '*'}
                </label>
                <input
                  type="number"
                  required={!editingUser}
                  min={2001}
                  max={new Date().getFullYear()}
                  placeholder={`Ej: ${new Date().getFullYear()}`}
                  value={studentForm.yearPromotion}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, yearPromotion: Number(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">Estado académico</label>
                <select
                  value={studentForm.status}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      status: e.target.value as 'Regular' | 'Reactualizacion',
                    })
                  }
                  className={inputClass}
                >
                  <option value="Regular">Regular</option>
                  <option value="Reactualizacion">Reactualización</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">
                  CUI {!editingUser && '*'}
                </label>
                <input
                  type="text"
                  required={!editingUser}
                  maxLength={20}
                  placeholder="Ej: 20260001"
                  value={studentForm.cui}
                  onChange={(e) => setStudentForm({ ...studentForm, cui: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">
                  Código de pago {!editingUser && '*'}
                </label>
                <input
                  type="text"
                  required={!editingUser}
                  maxLength={100}
                  placeholder="Ej: PAG-001"
                  value={studentForm.paymentCode}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, paymentCode: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">Teléfono</label>
                <input
                  type="tel"
                  maxLength={20}
                  placeholder="Ej: 999888777"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Datos del docente (cuando el rol es Docente) ── */}
        {form.role === 'Docente' && (
          <div className="space-y-4">
            <SectionHeader title="Datos del docente" />
            <div className="grid grid-cols-2 gap-4">

              {/* Tipo: Interno / Externo como pills */}
              <div className="col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-text">Tipo *</label>
                <div className="flex gap-2">
                  <RadioPill
                    name="teacherType"
                    value="Interno"
                    checked={teacherForm.type === 'Interno'}
                    onChange={() => setTeacherForm({ ...teacherForm, type: 'Interno', university: '' })}
                    label="Interno UNSA"
                  />
                  <RadioPill
                    name="teacherType"
                    value="Externo"
                    checked={teacherForm.type === 'Externo'}
                    onChange={() => setTeacherForm({ ...teacherForm, type: 'Externo', university: '' })}
                    label="Externo"
                  />
                </div>
                {teacherForm.type === 'Externo' && (
                  <p className="text-xs text-text-muted mt-1 italic">
                    El correo de docentes externos es generado por la OTI. El trámite puede
                    demorar hasta una semana.
                  </p>
                )}
              </div>

              {/* Universidad — automática para interno, input para externo */}
              {teacherForm.type === 'Interno' ? (
                <div className="col-span-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-muted">
                  Universidad:{' '}
                  <span className="font-medium text-text">
                    Universidad Nacional de San Agustín
                  </span>
                </div>
              ) : (
                <div className="col-span-2 space-y-1.5">
                  <label className="block text-sm font-medium text-text">Universidad</label>
                  <input
                    type="text"
                    maxLength={255}
                    placeholder="Ej: Universidad Nacional Mayor de San Marcos"
                    value={teacherForm.university}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, university: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              )}

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">Régimen</label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Ej: Tiempo completo"
                  value={teacherForm.regime}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, regime: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">Departamento</label>
                <input
                  type="text"
                  maxLength={255}
                  placeholder="Ej: Ingeniería de Sistemas"
                  value={teacherForm.department}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, department: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text">Teléfono</label>
                <input
                  type="tel"
                  maxLength={20}
                  placeholder="Ej: 999888777"
                  value={teacherForm.phone}
                  onChange={(e) =>
                    setTeacherForm({ ...teacherForm, phone: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {/* Nota informativa al pie del formulario */}
        <p className="text-xs text-text-muted italic">
          El correo debe pertenecer a una cuenta Google para que el usuario pueda iniciar sesión.
        </p>

        {/* Error devuelto por el servidor */}
        {formError && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
            {formError}
          </p>
        )}

        {/* Botones de acción — fijos al final del scroll */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {editingUser ? 'Guardar cambios' : 'Guardar usuario'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
