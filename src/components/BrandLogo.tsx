import { t } from '@/components/global/t';
import Icon from '@/components/global/Icon';

export const displayName = 'Brand Logo';
export const shortDescription = 'NodeFlux wordmark with a simple node glyph';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-foreground">
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <div className="relative flex size-5 items-center justify-center">
          <div className="absolute left-0 top-0 size-1.5 rounded-full bg-foreground" />
          <div className="absolute right-0 top-0 size-1.5 rounded-full bg-foreground" />
          <div className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-foreground" />
          <div className="h-px w-4 bg-foreground/70" />
          <div className="absolute top-1/2 h-3 w-px -translate-y-1/4 bg-foreground/70" />
        </div>
      </div>
      {!compact && (
        <div className="flex items-center gap-2">
          <span className="font-headings text-lg font-semibold tracking-tight">{t('NodeFlux')}</span>
          <div className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            <span>{t('API')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
