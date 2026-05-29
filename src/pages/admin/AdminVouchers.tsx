import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { StatusBadge } from '../../components/StatusBadge';
import {
  EyeIcon,
  XIcon,
  CheckIcon,
  AlertTriangleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const mockVouchers = [
{
  id: 1,
  estudiante: 'Juan Pérez',
  concepto: 'Matrícula 2024-I',
  monto: 'S/ 500.00',
  fecha: '20/05/2026',
  estado: 'pendiente'
},
{
  id: 2,
  estudiante: 'María González',
  concepto: 'Pensión Mayo',
  monto: 'S/ 350.00',
  fecha: '19/05/2026',
  estado: 'pendiente'
},
{
  id: 3,
  estudiante: 'Carlos Mendoza',
  concepto: 'Matrícula 2024-I',
  monto: 'S/ 500.00',
  fecha: '18/05/2026',
  estado: 'validado'
},
{
  id: 4,
  estudiante: 'Ana Rodríguez',
  concepto: 'Pensión Mayo',
  monto: 'S/ 350.00',
  fecha: '17/05/2026',
  estado: 'observado'
}];

export function AdminVouchers() {
  const { user } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [activeTab, setActiveTab] = useState<
    'pendientes' | 'validados' | 'observados' | 'rechazados'>(
    'pendientes');
  const [selectedVoucher, setSelectedVoucher] = useState<
    (typeof mockVouchers)[0] | null>(
    null);
  const [decision, setDecision] = useState<
    'validar' | 'observar' | 'rechazar' | null>(
    null);
  const [motivo, setMotivo] = useState('');
  const tabs = [
  {
    key: 'pendientes' as const,
    label: 'Pendientes',
    count: 7
  },
  {
    key: 'validados' as const,
    label: 'Validados',
    count: 0
  },
  {
    key: 'observados' as const,
    label: 'Observados',
    count: 0
  },
  {
    key: 'rechazados' as const,
    label: 'Rechazados',
    count: 0
  }];

  const filteredVouchers = mockVouchers.filter((v) => {
    if (activeTab === 'pendientes') return v.estado === 'pendiente';
    if (activeTab === 'validados') return v.estado === 'validado';
    if (activeTab === 'observados') return v.estado === 'observado';
    if (activeTab === 'rechazados') return v.estado === 'rechazado';
    return true;
  });
  return (
    <AdminLayout>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Gestión de Vouchers
        </h1>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            {tabs.map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-2 font-medium transition-colors relative ${activeTab === tab.key ? 'text-accent' : 'text-text-muted hover:text-text'}`}>
              
                {tab.label}
                {tab.count > 0 &&
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${activeTab === tab.key && tab.key === 'pendientes' ? 'bg-warning text-white' : 'bg-surface-alt text-text-muted'}`}>
                
                    {tab.count}
                  </span>
              }
                {activeTab === tab.key &&
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />

              }
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Monto declarado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Fecha de subida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Archivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVouchers.map((voucher, index) =>
                <tr
                  key={voucher.id}
                  className={
                  index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                  }>
                  
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {voucher.estudiante}
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {voucher.concepto}
                    </td>
                    <td className="px-6 py-4 text-sm text-text">
                      {voucher.monto}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {voucher.fecha}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-primary-light transition-colors">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                      variant={
                      voucher.estado === 'validado' ?
                      'validado' :
                      voucher.estado === 'observado' ?
                      'observado' :
                      voucher.estado === 'rechazado' ?
                      'rechazado' :
                      'pendiente'
                      }>
                      
                        {voucher.estado.charAt(0).toUpperCase() +
                      voucher.estado.slice(1)}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                      onClick={() => setSelectedVoucher(voucher)}
                      className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/5 transition-colors">
                      
                        Revisar
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Drawer */}
      <AnimatePresence>
        {selectedVoucher &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedVoucher(null)} />
          
            <motion.div
            initial={{
              x: '100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '100%'
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200
            }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-surface shadow-2xl z-50 overflow-y-auto">
            
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold text-text">
                    Revisar voucher
                  </h2>
                  <button
                  onClick={() => setSelectedVoucher(null)}
                  className="text-text-muted hover:text-text transition-colors">
                  
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* PDF Preview */}
                <div className="h-[280px] bg-surface-alt rounded-lg flex items-center justify-center border border-border">
                  <p className="text-text-muted">Vista previa del voucher</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Estudiante</p>
                    <p className="text-sm font-medium text-text">
                      {selectedVoucher.estudiante}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">N° recibo</p>
                    <p className="text-sm font-medium text-text">001234567</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">
                      Monto declarado
                    </p>
                    <p className="text-sm font-medium text-text">
                      {selectedVoucher.monto}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Fecha subida</p>
                    <p className="text-sm font-medium text-text">
                      {selectedVoucher.fecha}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-text-muted mb-1">
                      Pago asociado
                    </p>
                    <p className="text-sm font-medium text-text">
                      {selectedVoucher.concepto}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-text mb-4">Decisión</p>

                  <div className="space-y-3">
                    <button
                      disabled={isCoordinator}
                      onClick={() => setDecision('validar')}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${isCoordinator ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt' : decision === 'validar' ? 'bg-success text-white' : 'border border-success text-success hover:bg-success/10'}`}
                    >
                      <CheckIcon className="w-5 h-5" />
                      Validar
                    </button>
                    <button
                      disabled={isCoordinator}
                      onClick={() => setDecision('observar')}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${isCoordinator ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt' : decision === 'observar' ? 'bg-warning text-white' : 'border border-warning text-warning hover:bg-warning/10'}`}
                    >
                      <AlertTriangleIcon className="w-5 h-5" />
                      Observar
                    </button>
                    <button
                      disabled={isCoordinator}
                      onClick={() => setDecision('rechazar')}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${isCoordinator ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt' : decision === 'rechazar' ? 'bg-accent text-white' : 'border border-accent text-accent hover:bg-accent/10'}`}
                    >
                      <XIcon className="w-5 h-5" />
                      Rechazar
                    </button>
                  </div>

                  {(decision === 'observar' || decision === 'rechazar') &&
                    <div className="mt-4 space-y-2">
                      <label className="block text-sm font-medium text-text">
                        Motivo <span className="text-accent">*</span>
                      </label>
                      <textarea
                        disabled={isCoordinator}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Describe el motivo de observación o rechazo"
                        rows={4}
                        className={`w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isCoordinator ? 'bg-surface-alt text-text-muted cursor-not-allowed' : ''}`}
                      />
                    </div>
                  }

                  <button
                    disabled={
                      isCoordinator ||
                      !decision ||
                      ((decision === 'observar' || decision === 'rechazar') && !motivo)
                    }
                    className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar decisión
                  </button>

                  <p className="text-xs text-text-muted text-center mt-4">
                    Se registrará: usuario validador + fecha y hora
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </AdminLayout>);

}