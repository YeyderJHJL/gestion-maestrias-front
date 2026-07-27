# Sistema de Gestión Académica de Maestrías — Frontend

Interfaz web para la Oficina de Posgrado de la **Universidad Nacional de San Agustín (UNSA)**.  
Permite a administradores, coordinadores, docentes y estudiantes operar sobre la gestión académica del programa de Maestría en Informática: usuarios, cursos, matrículas, notas, pagos, vouchers, importaciones y reportes.

---

## Stack tecnológico

| Componente | Tecnología |
|---|---|
| React | 18 |
| Vite | 5.x |
| TypeScript | 5.x |
| Router | React Router DOM 6.x |
| UI / iconografía | Tailwind CSS, Framer Motion, Lucide React |
| Autenticación | Google OAuth 2.0 |
| Exportación de archivos | `xlsx`, `jspdf`, `jspdf-autotable` |
| HTTP | `fetch` con token en `sessionStorage` |

> SPA sin Redux. El estado de sesión se maneja en contexto React. La navegación se organiza por rol y cada sección usa layouts propios.

---

## Arquitectura

### Organización por capas en el front

La app no sigue una arquitectura de backend clásica, pero sí separa responsabilidades para que el flujo sea predecible y fácil de mantener.

```
src/
├── App.tsx               Rutas y guards de acceso
├── context/              Estado global de auth y sesión
├── components/           UI reutilizable y flujos comunes
├── layouts/              Shells visuales por rol
├── pages/                Pantallas por dominio
├── services/             Consumo de API
├── hooks/                Lógica reutilizable
├── types/                Tipos del dominio UI
└── utils/                Helpers puntuales
```

### Flujo de navegación

```
Usuario → /login → Google OAuth → token Google
	↓
AuthContext guarda el token en sessionStorage
	↓
buildAuthUser() consulta al backend y resuelve el usuario/rol
	↓
ProtectedRoute permite o bloquea el acceso
	↓
Layout del rol + página correspondiente
```

### Flujo de datos

- La UI consume la API del backend con `fetch`.
- El token se envía en el header `Authorization: Bearer <token>`.
- Las respuestas del backend alimentan tablas, modales, badges y estados de validación.
- Si la API responde `401`, el front dispara un evento de sesión expirada, limpia el estado y devuelve al login.

---

## Levantar el entorno de desarrollo

### Requisitos previos

- Node.js instalado.
- `pnpm` disponible.
- Backend ejecutándose.
- Un cliente OAuth de Google configurado para el entorno local.

### Variables de entorno

Crear un archivo `.env` en la raíz del front con al menos:

```env
VITE_GOOGLE_CLIENT_ID=tu_client_id_de_google
VITE_API_URL=http://localhost:8080/api
```

Si `VITE_API_URL` no se define, la app usa `/api` por defecto.

### Primer levantamiento

```bash
pnpm install
pnpm dev
```

### Comandos útiles

```bash
pnpm build
pnpm type-check
pnpm lint
pnpm preview
```

---

## Autenticación y sesión

El front usa Google OAuth como puerta de entrada, pero la identidad y el rol efectivo los resuelve el backend.

### Secuencia de login

1. El usuario entra a `/login` y pulsa el botón de Google.
2. `@react-oauth/google` obtiene un credential de Google Identity Services, que es el ID token que entrega Google al front.
3. `AuthContext.login()` reenvía ese credential al backend.
4. El backend valida el token, resuelve el usuario contra la base de datos en `/v1/users/me` y devuelve la información de sesión con su rol.
5. El front guarda el credential en `sessionStorage` con la clave `sga_token` y redirige a la ruta principal del rol detectado.

### Rehidratación y expiración

- Al recargar la página, el front intenta reconstruir la sesión leyendo `sessionStorage`.
- Antes de reutilizar el token, el front valida localmente su expiración leyendo el `exp` del JWT de Google.
- Si el token ya expiró o el backend responde `401`, se limpia la sesión y se redirige a `/login`.
- Si el backend responde `403`, la cuenta existe pero está desactivada, por lo que el login se bloquea con un mensaje distinto.

> El front no emite JWT propios ni maneja secretos de autenticación. Solo recibe el credential de Google, lo entrega al backend y conserva la sesión en el navegador mientras siga siendo válida.

> Si la cuenta no está registrada o está desactivada en el sistema, el login falla y la UI muestra el mensaje de administración correspondiente.

---

## Roles y autorización

| Rol | Acceso en la UI |
|---|---|
| `ADMIN` | Administración general del sistema |
| `COORDINATOR` | Acceso administrativo compartido con el dashboard principal |
| `TEACHER` | Consulta cursos y registra información académica |
| `STUDENT` | Consulta matrícula, notas, pagos e historial |

Las rutas se protegen con `ProtectedRoute`. El acceso no depende solo de mostrar u ocultar botones: si el rol no corresponde, la ruta no se monta.

---

## Módulos visibles

### Administración

La zona administrativa concentra el control operativo del sistema.

- Gestión de usuarios.
- Gestión de cursos.
- Gestión de matrículas.
- Validación de vouchers.
- Importación de notas.
- Reportes académicos.

Esta sección reúne los flujos donde se revisa, corrige o aprueba información, por eso usa modales de confirmación, búsqueda, estados visuales y mensajes de retroalimentación.

### Docente

El módulo docente está orientado a la carga y consulta de información académica.

- Dashboard con cursos asignados.
- Detalle de curso por ID.
- Registro de notas parciales y final.
- Modificación de notas con validaciones de negocio.

El front respeta las restricciones del dominio: no solo muestra formularios, también valida rangos, estados y consistencia antes de enviar cambios.

### Estudiante

El módulo del estudiante prioriza consulta y seguimiento.

- Dashboard del estudiante.
- Consulta de matrícula activa.
- Consulta de notas.
- Consulta de pagos.
- Consulta de historial académico.
- Detalle de curso por ID.

Aquí el valor principal es la lectura clara del estado académico, no la edición de datos.

---

## Rutas del frontend

### Públicas

- `/login`
- `/`

### Administrativas

- `/admin/dashboard`
- `/admin/usuarios`
- `/admin/cursos`
- `/admin/matriculas`
- `/admin/vouchers`
- `/admin/reportes`
- `/admin/importar`

### Docente

- `/docente/dashboard`
- `/docente/cursos/:id`

### Estudiante

- `/estudiante/dashboard`
- `/estudiante/matricula`
- `/estudiante/notas`
- `/estudiante/pagos`
- `/estudiante/historial`
- `/estudiante/cursos/:id`

---

## Repo wiring

| Ruta | Responsabilidad |
|---|---|
| `src/App.tsx` | Enrutamiento principal y guards por rol |
| `src/context/AuthContext.tsx` | Sesión, usuario actual, login y logout |
| `src/services/api.ts` | `fetch` autenticado contra la API |
| `src/services/*` | Servicios por dominio: usuarios, cursos, notas, pagos, archivos, reportes |
| `src/components/*` | Componentes compartidos de UI y flujos |
| `src/layouts/*` | Estructura visual por rol |
| `src/pages/*` | Pantallas de negocio |

---

## API y consumo de datos

La base URL del backend se resuelve con `VITE_API_URL`. Si no existe, la app intenta `/api`, lo que permite usar proxy local o despliegues donde el front y el backend comparten dominio.

`src/services/api.ts` centraliza el acceso autenticado y aplica una misma lógica para todos los módulos:

- agrega el header `Authorization`;
- normaliza respuestas vacías o `204`;
- convierte errores HTTP en una excepción común;
- dispara el evento `session-expired` cuando detecta `401`.

Además, varios servicios especializados gestionan archivos, vouchers, importaciones y descargas temporales, de modo que la UI no repite la lógica de transporte en cada pantalla.

---

## Componentes relevantes

- `DashboardLayout`, `Sidebar` y `Navbar` estructuran la navegación principal.
- `PageHeader`, `SearchBar`, `StatusBadge` y `Toast` cubren interacción cotidiana y feedback inmediato.
- `ConfirmationModal`, `EmptyState`, `FileUpload`, `FilePreviewModal` e `ImportGradesModal` cubren los flujos más sensibles del sistema.

Estas piezas permiten que las pantallas de negocio sean más pequeñas y que el comportamiento común quede centralizado.

---

## Notas técnicas

- El token de acceso se guarda en `sessionStorage`, no en `localStorage`.
- La sesión se rehace automáticamente si el token sigue siendo válido al recargar.
- Las rutas están protegidas por rol con `ProtectedRoute`.
- La navegación usa layouts distintos por perfil para mantener el contexto visual claro.
- La app incluye exportación de datos y documentos con `xlsx` y `jspdf`.

---

## Equipo

**pisw1-2026-grupo-2**  
Escuela Profesional de Ingeniería de Sistemas  
Universidad Nacional de San Agustín de Arequipa · 2026

