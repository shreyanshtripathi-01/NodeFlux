import { t } from '@/components/global/t';
import Icon from '@/components/global/Icon';

export const displayName = 'Brand Logo';
export const shortDescription = 'NodeFlux wordmark with a simple node glyph';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-foreground group">
      <div className="flex size-8 items-center justify-center transition-transform duration-300 group-hover:-translate-y-[1px]">
        <svg viewBox="0 0 64 64" fill="none" className="size-full text-foreground">
          <circle cx="16" cy="32" r="6" stroke="currentColor" strokeWidth="3" />
          <line x1="26" y1="32" x2="38" y2="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="48" cy="32" r="6" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      {!compact && (
        <div className="flex items-center gap-2">
          <span className="font-headings text-[20px] font-semibold tracking-tight text-foreground">
            {t('NodeFlux')}
          </span>
        </div>
      )}
    </div>
  );
}
