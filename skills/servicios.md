# Servicios API del frontend

Cliente base: `src/services/api.ts`

```ts
apiFetch<T>(path: string, token: string, options?: RequestInit): Promise<T>
// Añade Authorization: Bearer {token} y Content-Type: application/json
// Lanza ApiError(status, message) si !response.ok
```

Todos los endpoints devuelven `{ success, data, message }`. Los servicios extraen `.data` antes de retornar.

---

## usersApiService — `/v1/users`

```ts
interface User { id, email, firstName, lastName, dni?, role: UserRole, active, createdAt, updatedAt }
interface UserRequest { email, firstName, lastName, dni?, role: UserRole, active }

listUsers(token)                          → User[]
createUser(token, req: UserRequest)       → User
updateUser(token, id, req: UserRequest)   → User
deleteUser(token, id)                     → void
```

## userService — autenticación

```ts
login(email, password)   → { token, user: AuthUser }
logout(token)            → void
```

## studentsApiService — `/v1/students`

```ts
interface Promotion { id: number, name: string, year: number, active: boolean }

listPromotions(token)   → Promotion[]
// + endpoints de estudiante (creación con datos extra al crear usuario STUDENT)
```

## teachersApiService — `/v1/teachers`

```ts
type TeacherType = 'Interno' | 'Externo'
type TeacherCategory = 'Auxiliar' | 'Asociado' | 'Principal'
type AcademicDegree = 'Bachiller' | 'Licenciado' | 'Magíster' | 'Doctor'
```

## vouchersApiService — `/v1/vouchers`

```ts
listVouchers(token)                                   → VoucherResponse[]
reviewVoucher(token, id, req: VoucherReviewRequest)   → VoucherResponse
// VoucherStateCode: 'PENDING' | 'APPROVED' | 'REJECTED'
```

## programsApiService — `/v1/programs`

```ts
listPrograms(token)              → Program[]
createProgram(token, req)        → Program
updateProgram(token, id, req)    → Program
deleteProgram(token, id)         → void
```

## promotionsApiService — `/v1/promotions`

```ts
listPromotions(token)              → Promotion[]
createPromotion(token, req)        → Promotion
updatePromotion(token, id, req)    → Promotion
deletePromotion(token, id)         → void
```

## coursesApiService — `/v1/courses`

```ts
listCourses(token, promotionId?)   → Course[]
createCourse(token, req)           → Course
updateCourse(token, id, req)       → Course
deleteCourse(token, id)            → void
```

## importApiService — `/v1/import`

```ts
importStudents(token, students[])   → ImportResult
importTeachers(token, teachers[])   → ImportResult
```

## excelParser — `src/utils/excelParser.ts`

```ts
parseExcelStudents(file: File)   → Promise<ParsedStudent[]>
parseExcelTeachers(file: File)   → Promise<ParsedTeacher[]>
// Normaliza alias de columnas (ej. "Nombre" → firstName)
```
