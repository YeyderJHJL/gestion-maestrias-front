interface PeriodBannerProps {
  semesterCode: string;
  semesterYear: number;
}

export function PeriodBanner({ semesterCode, semesterYear }: PeriodBannerProps) {
  return (
    <div className="bg-primary text-white rounded-lg p-6">
      <h1 className="text-2xl font-serif font-bold">
        Periodo activo: {semesterYear}-{semesterCode}
      </h1>
      <p className="text-white/90 mt-1">
        {semesterCode === 'I' ? 'Primer' : 'Segundo'} semestre {semesterYear}
      </p>
    </div>
  );
}
