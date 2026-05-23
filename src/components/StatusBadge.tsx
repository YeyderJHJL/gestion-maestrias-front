import React from 'react';
type BadgeVariant =
'matriculado' |
'activo' |
'aprobado' |
'validado' |
'pendiente' |
'en-revision' |
'observado' |
'en-curso' |
'retiro' |
'rechazado' |
'desaprobado' |
'inactivo' |
'reactualizacion' |
'externo';
interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}
export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case 'matriculado':
      case 'activo':
      case 'aprobado':
      case 'validado':
        return 'bg-success text-white';
      case 'pendiente':
      case 'en-revision':
        return 'bg-warning text-white';
      case 'observado':
      case 'en-curso':
        return 'bg-warning text-white';
      case 'retiro':
      case 'rechazado':
      case 'desaprobado':
      case 'inactivo':
        return 'bg-accent text-white';
      case 'reactualizacion':
      case 'externo':
        return 'bg-primary-light text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStyles()}`}>
      
      {children}
    </span>);

}