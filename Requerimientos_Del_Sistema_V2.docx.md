



**UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA**

**DOCUMENTO DE REQUERIMIENTOS**

**Sistema Web Interno para Gestión Académica de Maestrías / Grados y Titulos**

| Campo | Detalle |
| :---- | :---- |
| Fuente del levantamiento | Última reunión con el cliente |
| Fecha del documento | 18 de mayo de 2026 |
| Versión | 2.0 |
| Tipo de documento | Requerimientos funcionales y no funcionales |
| Criterio de elaboración | Solo se considera la última reunión con el cliente; no se incluye información del inicio del proyecto como PO. |

# **Control de Versiones**

| Versión | Fecha | Descripción del cambio | Autor |
| :---- | :---- | :---- | :---- |
| 1.0 | 18/05/2026 | Versión inicial del análisis de requerimientos integrada con reuniones del cliente, alcance del PO, flujos UX y arquitectura preliminar. | Grupo 02 \- PISW1-2026 |
| 2.0 | 23/05/2026 | Se modifico requerimientos del modulo 1 y Requerimientos de información y datos | PO \- Mamani Uscamayta Agustin David |
| 2.1 | 05/06/2026 | Se agrego los requerimientos pendientes |  |

# **1\. Alcance funcional general**

| Código | Módulo | Descripción |
| :---- | :---- | :---- |
| Módulo 1 | Gestión Académica de Maestrías | Gestionar estudiantes, docentes, cursos, notas, pensiones, vouchers y reportes internos. |
| Módulo 2 | Gestion de Grados y Títulos | Registrar y consultar expedientes, asesores, jurados, resoluciones, sustentaciones, estados, plazos y reportes históricos. |

# **2\. Actores del sistema**

| Actor | Participación esperada |
| :---- | :---- |
| Administrador / Secretaria del área | Gestiona información académica, expedientes, reportes, pagos, vouchers, docentes, estudiantes y datos históricos. |
| Docente de maestría | Registra notas, consulta cursos asignados y visualiza estudiantes inscritos. Puede ser docente interno o externo. |
| Estudiante de maestría | Consulta notas, pensiones o pagos, y sube vouchers para validación administrativa. |
| Jurado / Asesor | Participa en expedientes de grados y títulos. Su información se registra para consultas y reportes históricos. |

# **3\. Requerimientos funcionales \- Módulo de Gestión Académica de Maestrías**

| Código | Requerimiento | Descripción | Prioridad |
| :---- | :---- | :---- | :---- |
| RF-MA-01 | Autenticación de usuarios | El sistema debe permitir el inicio de sesión de administradores, docentes y estudiantes. | Alta |
| RF-MA-02 | Gestión de estudiantes | El administrador debe registrar, editar, consultar y desactivar estudiantes de maestría. | Alta |
| RF-MA-03 | Gestión de docentes | El administrador debe registrar y administrar docentes internos y externos. | Alta |
| RF-MA-04 | Gestión de cursos | El sistema debe generar los cursos desde el plan de estudios.En caso no se genere de manera correcta el administrador debe ser capaz de agregar cursos de manera manual. | Alta |
| RF-MA-05 | Gestión de promociones o periodos | El sistema debe permitir organizar estudiantes y cursos por promoción, periodo o cohorte. | Alta |
| RF-MA-06 | Asignación docente-curso | El administrador debe asignar docentes a cursos específicas. | Alta |
| RF-MA-07 | Consulta de cursos asignados | El docente debe visualizar únicamente los cursos que tiene asignados. | Alta |
| RF-MA-08 | Listado de estudiantes por curso | El docente debe visualizar los estudiantes inscritos en cada curso asignado. | Alta |
| RF-MA-09 | Registro de notas finales | El docente debe registrar notas finales de los estudiantes inmediatamente después del curso. | Alta |
| RF-MA-10 | Consulta de notas por estudiante | El estudiante debe visualizar sus notas registradas en el sistema. | Alta |
| RF-MA-11 | Consulta de pensiones o pagos | El estudiante debe visualizar información de pensiones o pagos registrados. | Alta |
| RF-MA-12 | Carga de vouchers | El estudiante debe subir vouchers o comprobantes de pago al sistema. | Alta |
| RF-MA-13 | Validación de vouchers | El administrador debe validar, observar o rechazar los vouchers subidos por estudiantes. | Alta |
| RF-MA-14 | Observaciones de pago | El administrador debe registrar comentarios cuando un voucher sea observado. | Media |
| RF-MA-15 | Reportes académicos | El sistema debe generar reportes de estudiantes, cursos, notas y promociones. | Alta |
| RF-MA-16 | Exportación a Excel | El sistema debe exportar reportes académicos y administrativos a Excel. | Alta   |
| RF-MA-17  | Rol coordinador / auditor  | El sistema debe permitir un rol de coordinador con acceso de solo lectura a las mismas pantallas del administrador, sin permisos para crear, editar, eliminar o validar información.  | Alta  |
| RF-MA-18  | Importación de estudiantes y docentes desde Excel  | El administrador debe poder importar estudiantes y docentes mediante archivos Excel.  | Alta  |
| RF-MA-19  | Gestión de estados de matrícula  | El sistema debe permitir registrar y actualizar estados del estudiante: matriculado/vigente, egresado, abandono y reactualización.  | Alta  |
| RF-MA-20  | Reactualización de estudiantes  | El administrador debe poder revisar el historial académico del estudiante reactualizado y matricularlo manualmente en los cursos faltantes de la promoción vigente.  | Alta  |
| RF-MA-21  | Adjuntar resoluciones académicas  | El sistema debe permitir adjuntar resoluciones asociadas a retiro, abandono o reactualización del estudiante.  | Alta  |
| RF-MA-22 | Carga de sílabo del curso | El sistema debe permitir al docente adjuntar el sílabo del curso para consulta administrativa. | Media |
| RF-MA-23 | Gestión de cuotas del estudiante | El sistema debe manejar las 14 cuotas del programa de maestría, permitiendo visualizar su estado individual: pendiente, pagada, observada o validada. | Alta |
| RF-MA-24 | Registro de número de operación | Al subir un voucher, el estudiante debe ingresar manualmente el número de operación del comprobante de pago. | Alta |
| RF-MA-25 | Guía visual para carga de voucher | El sistema debe mostrar una imagen o ayuda visual indicando dónde ubicar el número de operación en el comprobante de pago. | Media |
| RF-MA-26 | Visualización de código de pago | El panel del estudiante debe mostrar permanentemente el código de pago para facilitar sus trámites. | Media |
| RF-MA-27 | Listado de estudiantes por promoción | El administrador debe poder visualizar los estudiantes pertenecientes a cada promoción, considerando que la promoción se define por año de ingreso y no por año de egreso. | Alta |
| RF-MA-28 | Auditoría de cambios en notas | El sistema debe registrar quién modificó una nota, cuándo la modificó y el motivo del cambio. | Alta |

# 

# **4\. Requerimientos funcionales \- Módulo de Grados y Títulos**

| Código | Requerimiento | Descripción | Prioridad |
| :---- | :---- | :---- | :---- |
| RF-GT-01 | Importación de datos desde Excel | El sistema debe permitir importar datos básicos del sistema actual, como número de expediente, modalidad y estado. | Alta |
| RF-GT-02 | Registro de expediente | El administrador debe registrar expedientes de grados y títulos. | Alta |
| RF-GT-03 | Fecha de inicio del expediente | El sistema debe registrar la fecha en la que el alumno inicia el trámite. | Alta |
| RF-GT-04 | Datos del graduando | El sistema debe almacenar nombres del graduando, escuela, especialidad o programa. | Alta |
| RF-GT-05 | Estado del expediente | El sistema debe manejar como mínimo los estados: en trámite, observado y completado. | Alta |
| RF-GT-06 | Registro de asesor | El sistema debe registrar el docente asesor asociado al expediente. | Alta |
| RF-GT-07 | Registro de jurados | El sistema debe registrar presidente, secretario, vocal y accesitario cuando corresponda. | Alta |
| RF-GT-08 | Número de resolución | El sistema debe registrar números de resolución asociados a asesores, jurados o expedientes. | Alta |
| RF-GT-09 | Aprobación de plan de tesis | El sistema debe permitir registrar información sobre la aprobación del plan de tesis. | Media |
| RF-GT-10 | Nombramiento de jurado | El sistema debe registrar el nombramiento de jurado generado por el área. | Alta |
| RF-GT-11 | Fecha de sustentación | El sistema debe registrar la fecha de sustentación. | Alta |
| RF-GT-12 | Resultado de sustentación | El sistema debe registrar si el alumno aprobó o no aprobó. | Alta |
| RF-GT-13 | Control de vigencia de expediente | El sistema debe controlar la vigencia reglamentaria de 18 meses del expediente. | Alta |
| RF-GT-14 | Alerta por revisión de jurado | El sistema debe alertar cuando un jurado exceda los 15 días reglamentarios de revisión. | Alta |
| RF-GT-15 | Búsqueda de expedientes | El sistema debe buscar expedientes por estudiante, docente, año, escuela, especialidad, modalidad, estado o resolución. | Alta |
| RF-GT-16 | Historial de docente | El sistema debe mostrar el historial de participación de un docente como asesor o jurado. | Alta |
| RF-GT-17 | Reporte de asesores y jurados | El sistema debe generar reportes de cuántos graduandos tuvo un docente como asesor o jurado. | Alta |
| RF-GT-18 | Reportes para acreditación | El sistema debe generar reportes por cantidad de alumnos, especialidades, modalidades, graduandos y estados. | Alta |
| RF-GT-19 | Exportación a Excel | El sistema debe exportar reportes históricos a Excel. | Alta |

# **5\. Requerimientos no funcionales**

| Código | Categoría | Descripción |
| :---- | :---- | :---- |
| RNF-01 | Disponibilidad en nube | La aplicación de maestrías debe alojarse en internet/nube porque no existe servidor físico asignado para posgrado. |
| RNF-02 | Independencia de módulos | Los sistemas de grados y de maestría deben funcionar de manera independiente, aunque compartan algunos catálogos. |
| RNF-03 | Seguridad por roles | Cada usuario debe acceder únicamente a las funciones permitidas por su rol. |
| RNF-04 | Trazabilidad | El sistema debe registrar quién creó, modificó, validó u observó información crítica como notas, vouchers, expedientes y resoluciones. |
| RNF-05 | Integridad de datos | Debe evitarse la modificación no autorizada de notas, pagos, resoluciones y estados de expedientes. |
| RNF-06 | Exportabilidad | Los reportes deben poder descargarse en formato Excel. |
| RNF-07 | Usabilidad | Las pantallas deben ser simples para personal administrativo, docentes y estudiantes. |
| RNF-08 | Respaldo de información | La información registrada debe poder respaldarse periódicamente. |
| RNF-09 | Escalabilidad funcional | El sistema debe permitir incorporar nuevos reportes, filtros y campos sin rediseñar toda la aplicación. |

# **6\. Requerimientos de información y datos**

| Entidad | Datos mínimos requeridos ajustados |
| ----- | ----- |
| **Estudiante** | Código, CUI, DNI, nombres, apellidos, correo institucional, teléfono, programa, promoción, estado. |
| **Docente** | Nombres, apellidos, DNI, categoría, régimen, grado académico, especialidad, celular, correo, tipo interno/externo, estado. |
| **Programa / Promoción** | Nombre, periodo, año, estado, programa asociado. |
| **Curso** | Código, nombre, tipo, duración, fecha de inicio, fecha de fin, observaciones, sílabo, estado. |
| **Asignación** | Curso, docente, fecha de asignación, estado. |
| **Matrícula** | Estudiante, curso, fecha, estado de matrícula, resolución asociada, observaciones. |
| **Nota Final** | Matrícula, valor de nota final, estado, fecha de registro, registrado por, fecha de modificación, modificado por, motivo de modificación. |
| **Voucher de Pago** | Estudiante, concepto, monto declarado, número de recibo si aplica, fecha de pago, archivo del voucher, estado, observación, validado por, fecha de validación. |

