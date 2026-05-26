import { LucideIcon } from 'lucide-react';
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon className="w-16 h-16 text-text-muted mb-4" />
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {subtitle && <p className="text-text-muted mb-6 max-w-md">{subtitle}</p>}
      {action &&
      <button
        onClick={action.onClick}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
        
          {action.label}
        </button>
      }
    </div>);

}