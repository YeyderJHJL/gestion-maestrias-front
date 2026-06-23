export type TipoReporte = 'Notas' | 'Matrículas' | 'Pagos' | 'Egresados';
export type EstadoReporte = 'Todos' | 'Aprobado' | 'Desaprobado' | 'Pendiente';

export interface ReporteFiltros {
  tipo: TipoReporte;
  periodo: string;
  programa: string;
  estado: EstadoReporte;
  estudiante: string;
  curso: string;
}

export interface ResultadoReporte {
  estudiante: string;
  codigo: string;
  curso: string;
  nota: number;
  estado: string;
}
