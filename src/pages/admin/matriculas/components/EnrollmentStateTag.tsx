interface Props {
  stateCode: string;
  stateName: string;
}

// Códigos reales de la tabla states (entity_type = 'ENROLLMENT')
const STATE_STYLES: Record<string, string> = {
  ENROLLED:  'bg-green-100 text-green-700 border border-green-200',
  WITHDRAWN: 'bg-red-100 text-red-700 border border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200',
};

export function EnrollmentStateTag({ stateCode, stateName }: Props) {
  const cls = STATE_STYLES[stateCode.toUpperCase()]
    ?? 'bg-gray-100 text-gray-600 border border-gray-200';
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {stateName}
    </span>
  );
}
