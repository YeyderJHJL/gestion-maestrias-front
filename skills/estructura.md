# Estructura del proyecto frontend

Stack: React 18 + TypeScript + Vite + Tailwind CSS 3 + React Router v6 + lucide-react

## Árbol de carpetas

```
src/
├── App.tsx                        # Rutas principales con React Router v6
├── index.tsx                      # Punto de entrada
├── index.css                      # Estilos globales Tailwind
├── vite-env.d.ts
│
├── context/
│   └── AuthContext.tsx            # Proveedor de sesión: { user: AuthUser, token, login, logout }
│
├── types/
│   ├── auth.ts                    # AuthUser, UserRole
│   └── voucher.ts                 # VoucherResponse, VoucherReviewRequest, VoucherStateCode
│
├── services/
│   ├── api.ts                     # apiFetch<T>(path, token, options) — cliente HTTP base
│   ├── usersApiService.ts         # CRUD /v1/users
│   ├── userService.ts             # login/logout (sin token)
│   ├── studentsApiService.ts      # listPromotions, /v1/students
│   ├── teachersApiService.ts      # /v1/teachers, enums TeacherType/Category/AcademicDegree
│   ├── vouchersApiService.ts      # listVouchers, reviewVoucher /v1/vouchers
│   ├── programsApiService.ts      # /v1/programs
│   ├── promotionsApiService.ts    # /v1/promotions
│   ├── coursesApiService.ts       # /v1/courses
│   └── importApiService.ts        # importStudents, importTeachers /v1/import
│
├── utils/
│   └── excelParser.ts             # parseExcelStudents, parseExcelTeachers (usa xlsx)
│
├── components/                    # Componentes globales reutilizables
│   ├── ConfirmationModal.tsx
│   ├── DashboardLayout.tsx
│   ├── EmptyState.tsx
│   ├── FileUpload.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx         # Wrapper de rutas por rol
│   ├── Sidebar.tsx
│   ├── StatusBadge.tsx
│   └── Toast.tsx
│
├── layouts/
│   ├── AdminLayout.tsx
│   ├── DocenteLayout.tsx
│   └── EstudianteLayout.tsx
│
└── pages/
    ├── Login.tsx
    ├── NotFound.tsx
    │
    ├── admin/
    │   ├── AdminDashboard.tsx
    │   ├── AdminMatriculas.tsx
    │   ├── AdminReportes.tsx
    │   ├── AdminCursos.tsx        # re-export → cursos/index.tsx
    │   ├── AdminUsuarios.tsx      # re-export → usuarios/index.tsx
    │   ├── AdminVouchers.tsx      # re-export → vouchers/index.tsx
    │   ├── AdminImportar.tsx      # re-export → importar/index.tsx
    │   │
    │   ├── cursos/
    │   │   ├── index.tsx          # Orquestador (Toast + ConfirmationModal)
    │   │   ├── cursos/
    │   │   │   ├── useCursos.ts
    │   │   │   ├── CursosTable.tsx
    │   │   │   └── CursoFormModal.tsx
    │   │   └── promociones/
    │   │       ├── usePromociones.ts
    │   │       ├── PromocionesPanel.tsx
    │   │       └── PromocionFormModal.tsx
    │   │
    │   ├── usuarios/
    │   │   ├── index.tsx
    │   │   ├── useUsuarios.ts
    │   │   ├── UsuariosTable.tsx
    │   │   └── UsuarioFormModal.tsx
    │   │
    │   ├── vouchers/
    │   │   ├── index.tsx
    │   │   ├── useAdminVouchers.ts
    │   │   ├── VouchersTable.tsx
    │   │   └── VoucherReviewDrawer.tsx
    │   │
    │   └── importar/
    │       ├── index.tsx
    │       ├── useImportFlow.ts
    │       └── ImportFlow.tsx
    │
    ├── docente/
    │   ├── DocenteDashboard.tsx
    │   └── DocenteCursoDetalle.tsx
    │
    └── estudiante/
        ├── EstudianteDashboard.tsx
        ├── EstudianteMatricula.tsx
        ├── EstudianteNotas.tsx
        ├── EstudiantePagos.tsx
        └── EstudianteHistorial.tsx
```

## Variables de entorno

| Variable       | Uso                                   |
|----------------|---------------------------------------|
| `VITE_API_URL` | Base URL del backend (default `/api`) |

## Roles de usuario

`ADMIN` | `COORDINATOR` | `TEACHER` | `STUDENT`
