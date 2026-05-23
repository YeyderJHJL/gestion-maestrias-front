# SGA Maestría — UNSA
**Sistema Web Interno de Gestión Académica · Maestría en Informática**  
Universidad Nacional de San Agustín de Arequipa · Facultad de Ingeniería de Producción y Servicios  
Proyecto de Ingeniería de Software · pisw1-2026-grupo-2

---

## Descripción

Aplicación web interna que centraliza la gestión académica del programa de Maestría en Informática de la UNSA. Reemplaza el uso de Excel, Word y búsquedas manuales para el registro de notas, control de pagos, gestión de matrículas y generación de reportes académicos.

El sistema opera como complemento independiente de los sistemas institucionales administrados por la OTI, sin modificarlos ni reemplazarlos.

---

## Módulos

### Módulo 1 — Gestión Académica de Maestrías
Cubre la gestión completa del ciclo académico: estudiantes, docentes, promociones, cursos, asignaciones, notas, pagos y vouchers.

### Módulo 2 — Gestión de Grados y Títulos
Registro y seguimiento de expedientes, asesores, jurados, resoluciones, sustentaciones y reportes históricos para acreditación. *(Aplicación independiente, fuera del alcance de esta versión.)*

---

## Roles del sistema

| Rol | Responsabilidades principales |
|---|---|
| Administrador / Secretaría | Gestiona datos maestros, valida vouchers, controla matrículas y genera reportes |
| Docente | Consulta cursos asignados, sube sílabo, registra notas y consulta su historial académico |
| Estudiante | Consulta notas y pagos, sube vouchers para validación |

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite (SPA responsive) |
| Backend | Spring Boot / Java (API REST) |
| Base de datos | PostgreSQL (Cloud SQL) |
| Almacenamiento de archivos | Google Cloud Storage (vouchers, sílabos, resoluciones) |
| Autenticación | Google OAuth 2.0 / OpenID Connect + JWT de sesión |
| Hosting frontend | Firebase Hosting + CDN |
| Hosting backend | Google Cloud Run (contenedor Docker) |
| Secretos | Google Secret Manager |
| Monitoreo | Cloud Logging + Cloud Monitoring |
| Notificaciones | SMTP externo |

---

## Arquitectura

Arquitectura en capas (monolítica modular) documentada con el modelo C4:

```
Presentación (SPA React)
      ↓ HTTPS / JSON
API REST - Controladores (Spring Boot)
      ↓
Capa de Aplicación - Servicios / Casos de uso
      ↓
Capa de Dominio - Entidades y reglas de negocio
      ↓
Capa de Infraestructura - JPA, Cloud Storage, JWT, SMTP
      ↓
Recursos externos: PostgreSQL · Cloud Storage · SMTP
```

---

## Funcionalidades principales

**Administrador**
- Gestión de usuarios: estudiantes (código, DNI, CUI, teléfono) y docentes (categoría, régimen, grado académico, tipo interno/externo)
- Gestión de promociones y cursos (Regular 4 semanas / Tesis / Tópicos 5 semanas) con fechas y observaciones
- Control de matrículas con estados: Matriculado, Retiro y Reactualización (adjunto de resoluciones PDF)
- Validación de vouchers: aprobar, observar o rechazar con motivo registrado
- Generación y exportación de reportes académicos a Excel y PDF

**Docente**
- Consulta de cursos asignados en el periodo activo
- **Historial académico**: separación de cursos actuales y cursos dictados anteriormente
- Carga obligatoria de sílabo por curso (PDF)
- Registro de notas parciales y nota final (validación rango 0–20)
- Modificación de notas con motivo obligatorio y auditoría completa (usuario, fecha, motivo)

**Estudiante**
- Consulta de matrícula activa y estado (Matriculado / Retiro / Reactualización)
- Consulta de notas parciales y finales por periodo con estado académico
- Consulta de pagos y pensiones con estado de validación
- Carga de vouchers de pago (PDF, JPG, PNG, máx. 5 MB)
- Descarga de récord académico en PDF

---

## Seguridad y trazabilidad

- Autenticación federada con cuentas Google institucionales (`@unsa.edu.pe`) provistas por la OTI
- Autorización por rol mediante JWT de sesión propio
- Auditoría obligatoria en notas, vouchers y validaciones: usuario responsable + fecha y hora
- Integridad garantizada por validaciones en capa de dominio y restricciones en base de datos

---

## Rutas del frontend

```
/login

/admin/dashboard
/admin/usuarios
/admin/cursos
/admin/matriculas
/admin/vouchers
/admin/reportes

/docente/dashboard
/docente/cursos/:id
/docente/historial

/estudiante/dashboard
/estudiante/matricula
/estudiante/notas
/estudiante/pagos
/estudiante/historial
```

---

## Documentación del proyecto

| Documento | Código | Versión |
|---|---|---|
| Documento de Requerimientos | — | v2.0 |
| Historias de Usuario (HU-01 a HU-20) | — | v1.0 |
| Flujos Funcionales por Rol (UX) | PISW1-2026-G2-UX-001 | v2.0 |
| Documento de Arquitectura de Software | PISW1-2026-G2-SAD-001 | v1.0 |

---

## Equipo

**pisw1-2026-grupo-2**  
Escuela Profesional de Ingeniería de Sistemas  
Universidad Nacional de San Agustín de Arequipa · 2026

