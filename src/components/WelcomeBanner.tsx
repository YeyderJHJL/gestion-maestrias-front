import { motion } from 'framer-motion';

interface WelcomeBannerProps {
  title: string;
  subtitle?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export function WelcomeBanner({ title, subtitle, animated = true, children }: WelcomeBannerProps) {
  const content = (
    <div className="bg-primary text-white rounded-lg p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-serif font-bold">{title}</h1>
      {subtitle && <p className="text-white/90 mt-1 text-sm md:text-base">{subtitle}</p>}
      {children}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {content}
    </motion.div>
  );
}
