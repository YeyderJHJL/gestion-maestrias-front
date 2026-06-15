# Guía: crear un nuevo módulo CRUD para el panel admin

Todos los módulos admin siguen el mismo patrón. Usa esto como referencia exacta.

## Estructura de carpetas

```
src/pages/admin/{modulo}/
├── index.tsx          # Orquestador: monta Toast + ConfirmationModal + sub-componentes
├── use{Modulo}.ts     # Hook: todo el estado, CRUD, modales, toast, filtros
├── {Modulo}Table.tsx  # Tabla con acciones editar/eliminar
└── {Modulo}FormModal.tsx  # Modal de crear/editar con formulario
```

Y crear el re-export de compatibilidad:
```
src/pages/admin/Admin{Modulo}.tsx  → re-export de {modulo}/index.tsx
```

## 1. Servicio (`src/services/{modulo}ApiService.ts`)

```ts
import { apiFetch } from './api';

export interface {Modulo} { id: string; /* campos */ }
export interface {Modulo}Request { /* campos sin id ni timestamps */ }

interface ApiResponse<T> { success: boolean; data: T; message: string | null }

export async function list{Modulos}(token: string): Promise<{Modulo}[]> {
  const res = await apiFetch<ApiResponse<{Modulo}[]>>('/v1/{modulos}', token);
  return res.data;
}
export async function create{Modulo}(token: string, req: {Modulo}Request): Promise<{Modulo}> {
  const res = await apiFetch<ApiResponse<{Modulo}>>('/v1/{modulos}', token, {
    method: 'POST', body: JSON.stringify(req),
  });
  return res.data;
}
export async function update{Modulo}(token: string, id: string, req: {Modulo}Request): Promise<{Modulo}> {
  const res = await apiFetch<ApiResponse<{Modulo}>>(`/v1/{modulos}/${id}`, token, {
    method: 'PUT', body: JSON.stringify(req),
  });
  return res.data;
}
export async function delete{Modulo}(token: string, id: string): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/{modulos}/${id}`, token, { method: 'DELETE' });
}
```

## 2. Hook (`use{Modulo}.ts`)

```ts
import { useCallback, useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../services/api';
import { {Modulo}, {Modulo}Request, list{Modulos}, create{Modulo}, update{Modulo}, delete{Modulo} } from '../../../services/{modulo}ApiService';

const EMPTY: {Modulo}Request = { /* campos vacíos */ };

export function use{Modulo}() {
  const { token } = useAuth();
  const [items, setItems] = useState<{Modulo}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<{Modulo} | null>(null);
  const [form, setForm] = useState<{Modulo}Request>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState<{Modulo} | null>(null);

  const [toast, setToast] = useState<{ visible: boolean; variant: 'success'|'error'; message: string }>
    ({ visible: false, variant: 'success', message: '' });
  const showToast = (variant: 'success'|'error', message: string) =>
    setToast({ visible: true, variant, message });

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    list{Modulos}(token).then(setItems).catch((e: Error) => setError(e.message)).finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openCreateModal = () => { setEditing(null); setForm(EMPTY); setFormError(null); setIsModalOpen(true); };
  const openEditModal = (item: {Modulo}) => { setEditing(item); setForm({ /* mapear campos */ }); setFormError(null); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditing(null); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true); setFormError(null);
    try {
      if (editing) { await update{Modulo}(token, editing.id, form); showToast('success', '{Modulo} actualizado.'); }
      else { await create{Modulo}(token, form); showToast('success', '{Modulo} creado.'); }
      closeModal(); load();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al guardar.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!token || !deleting) return;
    try {
      await delete{Modulo}(token, deleting.id);
      setItems(prev => prev.filter(i => i.id !== deleting.id));
      showToast('success', '{Modulo} eliminado.');
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al eliminar.');
    } finally { setDeleting(null); }
  };

  return { items, loading, error, isModalOpen, editing, form, setForm, submitting, formError,
    openCreateModal, openEditModal, closeModal, handleSubmit, deleting, setDeleting, handleDelete,
    toast, setToast };
}
```

## 3. index.tsx (orquestador)

```tsx
import React from 'react';
import { use{Modulo} } from './use{Modulo}';
import { {Modulo}Table } from './{Modulo}Table';
import { {Modulo}FormModal } from './{Modulo}FormModal';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';

export function Admin{Modulo}() {
  const hook = use{Modulo}();
  return (
    <div>
      <{Modulo}Table {...hook} />
      <{Modulo}FormModal {...hook} />
      <ConfirmationModal
        isOpen={!!hook.deleting}
        title="Eliminar {modulo}"
        message={`¿Eliminar "${hook.deleting?.nombre}"?`}
        onConfirm={hook.handleDelete}
        onCancel={() => hook.setDeleting(null)}
      />
      <Toast
        visible={hook.toast.visible}
        variant={hook.toast.variant}
        message={hook.toast.message}
        onClose={() => hook.setToast(t => ({ ...t, visible: false }))}
      />
    </div>
  );
}
```

## 4. Agregar ruta en `src/App.tsx`

```tsx
import { Admin{Modulo} } from './pages/admin/Admin{Modulo}';
// Dentro del bloque de rutas ADMIN:
<Route path="/admin/{modulo}" element={<Admin{Modulo} />} />
```

## 5. Agregar enlace en `src/layouts/AdminLayout.tsx`

Buscar el array de items de navegación y agregar el nuevo módulo con su ícono de lucide-react.

---

**Referencia**: ver `src/pages/admin/usuarios/` como implementación completa y funcional.
