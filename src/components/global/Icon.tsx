import * as LucideIcons from 'lucide-react';

export default function Icon({ i, size = 24 }: { i: string; size?: number }) {
  // Convert kebab-case to PascalCase for lucide-react (e.g. clock-3 -> Clock3, arrow-left -> ArrowLeft)
  const iconName = i
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
    
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return <IconComponent size={size} />;
}
