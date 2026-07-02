import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReceiptIcon, BookOpenIcon, ClipboardListIcon } from 'lucide-react';
import { ActivityItem, ActivityType } from '../../../../../services/dashboardApiService';
import { useAuth } from '../../../../../context/AuthContext';
import { getFileUrl } from '../../../../../services/filesApiService';
import { Modal } from '../../../../../components/Modal';

interface Props {
  activity: ActivityItem[];
}

const TYPE_CONFIG: Record<ActivityType, {
  label: string;
  badgeCls: string;
  Icon: React.ElementType;
  iconCls: string;
}> = {
  voucher: {
    label: 'Voucher',
    badgeCls: 'bg-primary text-white',
    Icon: ReceiptIcon,
    iconCls: 'text-primary',
  },
  silabo: {
    label: 'Sílabo',
    badgeCls: 'bg-green-600 text-white',
    Icon: BookOpenIcon,
    iconCls: 'text-green-600',
  },
  nota: {
    label: 'Nota',
    badgeCls: 'bg-warning text-white',
    Icon: ClipboardListIcon,
    iconCls: 'text-warning',
  },
};

function relativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  if (days > 0) return rtf.format(-days, 'day');
  if (hours > 0) return rtf.format(-hours, 'hour');
  if (minutes > 0) return rtf.format(-minutes, 'minute');
  return 'ahora mismo';
}

export function RecentActivity({ activity }: Props) {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleRowClick = async (item: ActivityItem) => {
    if (item.fileId && token) {
      try {
        setIsLoadingFile(true);
        const fileData = await getFileUrl(token, item.fileId);
        setModalTitle(item.description);
        setModalContent(
          <iframe 
            src={fileData.downloadUrl} 
            className="w-full h-[70vh] border-0 rounded" 
            title={item.description}
          />
        );
        setIsModalOpen(true);
      } catch (err) {
        console.error('Error fetching file URL:', err);
      } finally {
        setIsLoadingFile(false);
      }
      return;
    }
    
    if (item.type === 'nota' && item.gradeValue !== undefined) {
      setModalTitle('Detalle de Calificación');
      setModalContent(
        <div className="text-center py-8">
          <p className="text-text-muted text-sm mb-2">{item.description}</p>
          <p className="text-lg text-text">
            El estudiante <span className="font-semibold">{item.actor}</span> ha obtenido la nota:
          </p>
          <div className="text-6xl font-bold text-accent mt-6">
            {item.gradeValue}
          </div>
        </div>
      );
      setIsModalOpen(true);
      return;
    }

    if (item.href) {
      navigate(item.href);
    }
  };

  return (
    <>
    <div className={`bg-surface border border-border rounded-lg shadow-sm overflow-hidden ${isLoadingFile ? 'opacity-70 pointer-events-none' : ''}`}>
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-xl font-serif font-bold text-text">Actividad reciente</h2>
      </div>

      {activity.length === 0 ? (
        <p className="px-6 py-8 text-sm text-text-muted text-center">
          No hay actividad reciente registrada.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Fecha y hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activity.map((item, index) => {
                const cfg = TYPE_CONFIG[item.type];
                const Icon = cfg.Icon;
                const baseRowClass = index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt';
                const clickableClass = (item.href || item.fileId || item.type === 'nota') ? 'cursor-pointer hover:bg-surface-hover transition-colors' : '';
                
                return (
                  <tr
                    key={index}
                    className={`${baseRowClass} ${clickableClass}`}
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeCls}`}>
                        <Icon className={`w-3 h-3`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {item.actor}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                      {relativeTime(item.timestamp)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={modalTitle}
      size={modalContent && (modalContent as any).type === 'iframe' ? 'xl' : 'sm'}
      accentBorder
    >
      {modalContent}
    </Modal>
    </>
  );
}
