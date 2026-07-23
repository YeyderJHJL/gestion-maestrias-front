import { LucideIcon } from 'lucide-react';

export type IconButtonVariant = 'primary' | 'success' | 'accent' | 'warning' | 'muted';

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  variant?: IconButtonVariant;
  disabled?: boolean;
}

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  primary: 'border-primary text-primary bg-primary/5 hover:bg-primary/15',
  success: 'border-success text-success bg-success/5 hover:bg-success/15',
  accent:  'border-accent text-accent bg-accent/5 hover:bg-accent/15',
  warning: 'border-warning text-warning bg-warning/5 hover:bg-warning/15',
  muted:   'border-border text-text-muted bg-surface-alt hover:bg-surface',
};

export function IconButton({ icon: Icon, onClick, title, variant = 'primary', disabled }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]}`}
    >
      <Icon className="w-4 h-4" strokeWidth={2.5} />
    </button>
  );
}
