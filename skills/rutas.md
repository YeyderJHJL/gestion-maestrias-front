# Rutas de la aplicación

Definidas en `src/App.tsx`. Protegidas por `<ProtectedRoute allowedRoles={[...]} />`.

## Rutas por rol

### Pública
| Ruta     | Componente |
|----------|------------|
| `/login` | `Login`    |
| `/`      | → redirect `/login` |

### ADMIN + COORDINATOR
| Ruta                 | Componente        |
|----------------------|-------------------|
| `/admin/dashboard`   | `AdminDashboard`  |
| `/admin/usuarios`    | `AdminUsuarios`   |
| `/admin/cursos`      | `AdminCursos`     |
| `/admin/matriculas`  | `AdminMatriculas` |
| `/admin/vouchers`    | `AdminVouchers`   |
| `/admin/reportes`    | `AdminReportes`   |

### ADMIN only
| Ruta              | Componente     |
|-------------------|----------------|
| `/admin/importar` | `AdminImportar`|

### TEACHER
| Ruta                   | Componente            |
|------------------------|-----------------------|
| `/docente/dashboard`   | `DocenteDashboard`    |
| `/docente/cursos/:id`  | `DocenteCursoDetalle` |

### STUDENT
| Ruta                       | Componente              |
|----------------------------|-------------------------|
| `/estudiante/dashboard`    | `EstudianteDashboard`   |
| `/estudiante/matricula`    | `EstudianteMatricula`   |
| `/estudiante/notas`        | `EstudianteNotas`       |
| `/estudiante/pagos`        | `EstudiantePagos`       |
| `/estudiante/historial`    | `EstudianteHistorial`   |

## Auth context

```ts
const { user, token, login, logout } = useAuth();
// user: AuthUser | null
// token: string | null  — se pasa a cada llamada de servicio
```
