interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 border-b-2 border-accent pb-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-text">{title}</h1>
        {subtitle && <p className="text-xs md:text-sm text-text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
