import React, { useState, Fragment } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { FileUpload } from '../../components/FileUpload';
import {
  ClipboardListIcon,
  FileTextIcon,
  ReceiptIcon,
  FolderIcon,
  ChevronDownIcon,
  CheckCircleIcon } from
'lucide-react';
const sidebarLinks = [
{
  to: '/estudiante/matricula',
  icon: ClipboardListIcon,
  label: 'Mi Matrícula'
},
{
  to: '/estudiante/notas',
  icon: FileTextIcon,
  label: 'Mis Notas'
},
{
  to: '/estudiante/pagos',
  icon: ReceiptIcon,
  label: 'Pagos y Vouchers'
},
{
  to: '/estudiante/historial',
  icon: FolderIcon,
  label: 'Historial Académico'
}];

const mockPayments = [
{
  concepto: 'Matrícula 2024-I',
  monto: 'S/ 500.00',
  fecha: '15/03/2024',
  recibo: '001234567',
  estado: 'validado'
},
{
  concepto: 'Pensión Marzo',
  monto: 'S/ 350.00',
  fecha: '20/03/2024',
  recibo: '001234568',
  estado: 'validado'
},
{
  concepto: 'Pensión Abril',
  monto: 'S/ 350.00',
  fecha: '18/04/2024',
  recibo: '001234569',
  estado: 'pendiente'
},
{
  concepto: 'Pensión Mayo',
  monto: 'S/ 350.00',
  fecha: '15/05/2024',
  recibo: '001234570',
  estado: 'observado',
  motivo:
  'El monto declarado no coincide con el comprobante. Por favor verifica.'
}];

export function EstudiantePagos() {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [voucherSubmitted, setVoucherSubmitted] = useState(false);
  return (
    <DashboardLayout
      userName="Juan Carlos Pérez"
      userRole="Estudiante de Maestría"
      sidebarLinks={sidebarLinks}>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">
          Pagos y Vouchers
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payments Table */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-serif font-bold text-text">
                Mis pagos y pensiones
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Concepto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      N° recibo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPayments.map((payment, index) =>
                  <Fragment key={index}>
                      <tr
                      className={
                      index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'
                      }>
                      
                        <td className="px-6 py-4 text-sm text-text font-medium">
                          {payment.concepto}
                        </td>
                        <td className="px-6 py-4 text-sm text-text">
                          {payment.monto}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {payment.fecha}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted">
                          {payment.recibo}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge
                          variant={
                          payment.estado === 'validado' ?
                          'validado' :
                          payment.estado === 'observado' ?
                          'observado' :
                          payment.estado === 'rechazado' ?
                          'rechazado' :
                          'pendiente'
                          }>
                          
                            {payment.estado === 'validado' ?
                          'Validado' :
                          payment.estado === 'observado' ?
                          'Observado' :
                          payment.estado === 'rechazado' ?
                          'Rechazado' :
                          'Pendiente de validación'}
                          </StatusBadge>
                        </td>
                        <td className="px-6 py-4">
                          {(payment.estado === 'observado' ||
                        payment.estado === 'rechazado') &&
                        <button
                          onClick={() =>
                          setExpandedRow(
                            expandedRow === index ? null : index
                          )
                          }
                          className="text-accent hover:text-accent-light transition-colors">
                          
                              <ChevronDownIcon
                            className={`w-5 h-5 transition-transform ${expandedRow === index ? 'rotate-180' : ''}`} />
                          
                            </button>
                        }
                        </td>
                      </tr>
                      {expandedRow === index && payment.motivo &&
                    <tr>
                          <td colSpan={6} className="px-6 py-4 bg-accent/10">
                            <div className="text-sm">
                              <p className="font-semibold text-accent mb-1">
                                {payment.estado === 'observado' ?
                            'Motivo de observación:' :
                            'Motivo de rechazo:'}
                              </p>
                              <p className="text-text">{payment.motivo}</p>
                            </div>
                          </td>
                        </tr>
                    }
                    </Fragment>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Upload Voucher */}
          <div className="bg-surface border-t-4 border-accent rounded-lg p-6 shadow-sm h-fit">
            {!voucherSubmitted ?
            <form className="space-y-6">
                <h2 className="text-lg font-serif font-bold text-text">
                  Adjuntar comprobante de pago
                </h2>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    ¿A qué pago corresponde?
                  </label>
                  <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Seleccionar...</option>
                    <option>Pensión Mayo</option>
                    <option>Pensión Junio</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    N° de recibo
                  </label>
                  <input
                  type="text"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    Fecha del pago
                  </label>
                  <input
                  type="date"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">
                    Monto declarado (S/.)
                  </label>
                  <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                
                </div>

                <FileUpload
                onFileSelect={(file) => console.log(file)}
                acceptedFormats=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={5}
                label="Arrastra el comprobante aquí o haz clic para seleccionar" />
              

                <button
                type="button"
                onClick={() => setVoucherSubmitted(true)}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold">
                
                  Enviar voucher
                </button>
              </form> :

            <div className="text-center space-y-4 py-8">
                <CheckCircleIcon className="w-16 h-16 text-success mx-auto" />
                <h3 className="text-lg font-semibold text-text">
                  Voucher enviado correctamente
                </h3>
                <p className="text-text-muted">
                  Estado actual: Pendiente de validación
                </p>
                <p className="text-sm text-text-muted">
                  Recibirás una notificación cuando sea revisado.
                </p>
                <button
                onClick={() => setVoucherSubmitted(false)}
                className="text-primary hover:text-primary-light font-medium text-sm">
                
                  Enviar otro voucher
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </DashboardLayout>);

}