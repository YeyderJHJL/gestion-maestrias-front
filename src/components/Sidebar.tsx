import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
interface SidebarLink {
  to: string;
  icon: LucideIcon;
  label: string;
  dividerAfter?: boolean;
}
interface SidebarProps {
  links: SidebarLink[];
}
export function Sidebar({ links }: SidebarProps) {
  const location = useLocation();
  return (
    <aside className="bg-[#1A2F5A] text-white w-60 h-full flex flex-col">
      <nav className="py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Fragment key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-[#2E5FA3] rounded-md transition-colors mx-2 ${isActive ? 'border-l-4 border-[#7B1D2E] bg-[#2E5FA3]' : ''}`}>
                
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
              {link.dividerAfter &&
              <div className="my-2 mx-6 border-t border-white/20" />
              }
            </Fragment>);

        })}
      </nav>
    </aside>);

}