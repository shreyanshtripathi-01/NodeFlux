import { t } from '@/components/global/t';
import Icon from '@/components/global/Icon';

export const displayName = 'Brand Logo';
export const shortDescription = 'NodeFlux wordmark with a simple node glyph';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-foreground group">
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-panel to-elevated border border-border/50 shadow-sm transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 24 24" fill="none" className="size-5 text-foreground">
          <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="4" r="3" fill="currentColor" />
          <circle cx="12" cy="20" r="3" fill="currentColor" />
          <circle cx="4" cy="12" r="3" fill="currentColor" />
          <circle cx="20" cy="12" r="3" fill="currentColor" />
          <circle cx="12" cy="12" r="4" fill="var(--color-success)" />
        </svg>
      </div>
      {!compact && (
        <div className="flex items-center gap-2">
          <span className="font-headings text-xl font-bold tracking-tighter">
            {t('NodeFlux')}
            <span className="text-success">.</span>
          </span>
        </div>
      )}
    </div>
  );
}
