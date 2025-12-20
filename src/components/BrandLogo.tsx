import { t } from '@/components/global/t';
import Icon from '@/components/global/Icon';

export const displayName = 'Brand Logo';
export const shortDescription = 'NodeFlux wordmark with a simple node glyph';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 text-foreground group">
      <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 24 24" fill="none" className="size-6 text-foreground">
          <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
        </svg>
      </div>
      {!compact && (
        <span className="font-headings text-lg font-semibold tracking-tight">
          NodeFlux
        </span>
      )}
    </div>
  );
}
