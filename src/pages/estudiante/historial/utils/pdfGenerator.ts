import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { HistoryPeriod } from '../hooks/useHistorial';

async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Canvas ctx is null'));
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

export async function generateAcademicRecordPDF(history: HistoryPeriod[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFont('helvetica');

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.');
  const timeStr = now.toLocaleTimeString('es-PE', { hour12: false });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RÉCORD ACADÉMICO', 148, 20, { align: 'center' });

  try {
    const logoBase64 = await getBase64ImageFromUrl('/img/escudoUNSA.webp');
    doc.addImage(logoBase64, 'PNG', 15, 12, 18, 18);

    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.text('UNSA', 35, 23);

    doc.setFontSize(6);
    doc.setTextColor(100);
    doc.text('UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA', 35, 27);
  } catch (error) {
    console.error('No se pudo cargar el logo', error);
  }

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('FECHA :', 230, 18);
  doc.text('HORA :', 230, 23);
  doc.text('PÁGINA :', 230, 28);

  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, 250, 18);
  doc.text(timeStr, 250, 23);
  doc.text('1 / 1', 250, 28);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL ESTUDIANTE', 35, 40);

  doc.text('CUI :', 90, 40);
  doc.text('NOMBRE :', 145, 40);

  doc.text('INGRESO :', 90, 46);
  doc.text('DNI :', 145, 46);

  doc.setFont('helvetica', 'normal');
  doc.text('20223011', 110, 40);
  doc.text('HIDALGO CHINCHAY, PAULO ANDRE', 165, 40);
  doc.text('2026', 110, 46);
  doc.text('72790977', 165, 46);

  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DE ESCUELA', 35, 56);

  doc.text('NIVEL :', 90, 56);
  doc.text('NOMBRE :', 145, 56);

  doc.setFont('helvetica', 'normal');
  doc.text('POSGRADO', 110, 56);

  doc.setLineWidth(0.5);
  doc.line(15, 62, 282, 62);

  const allApproved = history.flatMap(period =>
    period.cursos
      .filter(c => c.estado === 'aprobado')
      .map((curso, index) => [
        (index + 1).toString(),
        period.year.toString(),
        curso.nombre.toUpperCase(),
        curso.notaFinal !== null ? curso.notaFinal.toString() : '',
        'Aprobado',
        curso.creditos.toFixed(2),
        period.periodo
      ])
  );

  autoTable(doc, {
    startY: 65,
    head: [['Nro', 'Año', 'Nombre de la Asignatura', 'Nota', 'Condición', 'Cred', 'Periodo']],
    body: [
      [{ content: 'ASIGNATURAS APROBADAS', colSpan: 7, styles: { fontStyle: 'bold', halign: 'left', fillColor: [255, 255, 255], textColor: [0, 0, 0] } }],
      ...allApproved
    ],
    theme: 'plain',
    headStyles: {
      fontStyle: 'bold',
      textColor: [0, 0, 0],
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 15, halign: 'center' },
      2: { cellWidth: 130 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 25, halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  });

  doc.save('record_academico.pdf');
}
