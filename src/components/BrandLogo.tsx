import { t } from '@/components/global/t';

export const displayName = 'Brand Logo';
export const shortDescription = 'NodeFlux wordmark with a simple node glyph';

export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 text-foreground group select-none">
      {/* Simple geometric mark — two overlapping circles */}
      <div className="relative flex size-7 items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <div className="absolute w-4 h-4 rounded-full border-2 border-foreground -translate-x-[3px]" />
        <div className="absolute w-4 h-4 rounded-full border-2 border-foreground translate-x-[3px]" />
      </div>
      {!compact && (
        <span className="font-headings text-lg font-semibold tracking-tight">
          {t('NodeFlux')}
        </span>
      )}
    </div>
  );
}
