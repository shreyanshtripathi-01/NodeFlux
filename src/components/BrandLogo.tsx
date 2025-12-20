import { t } from '@/components/global/t';
import Icon from '@/components/global/Icon';

export const displayName = 'Brand Logo';
export const shortDescription = 'NodeFlux wordmark with a simple node glyph';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-foreground group select-none">
      <div className="flex items-center justify-center transition-transform duration-300 group-hover:-rotate-12">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      </div>
      {!compact && (
        <span className="font-headings text-xl font-medium tracking-tight">
          {t('NodeFlux')}
        </span>
      )}
    </div>
  );
}
