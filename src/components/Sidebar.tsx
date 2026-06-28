import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, XIcon } from 'lucide-react';

interface SidebarLink {
  to: string;
  icon: LucideIcon;
  label: string;
  dividerAfter?: boolean;
}

interface SidebarProps {
  links: SidebarLink[];
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ links, open, onClose }: SidebarProps) {
  const location = useLocation();

  const nav = (
    <aside className="bg-[#1A2F5A] text-white w-60 h-full flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <span className="font-serif font-bold text-sm">Menú</span>
        <button onClick={onClose} className="p-1 hover:bg-[#2E5FA3] rounded transition-colors">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <nav className="py-4 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Fragment key={link.to}>
              <Link
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#2E5FA3] rounded-md transition-colors mx-2 ${isActive ? 'border-l-4 border-[#7B1D2E] bg-[#2E5FA3]' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
              {link.dividerAfter && <div className="my-2 mx-6 border-t border-white/20" />}
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Desktop: sidebar fijo */}
      <div className="hidden md:block">{nav}</div>

      {/* Mobile: overlay */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">{nav}</div>
        </>
      )}
    </>
  );
}
