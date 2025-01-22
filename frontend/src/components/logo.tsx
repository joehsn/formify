import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { FileText as FileTextIcon } from 'lucide-react';

interface Props {
  className?: string;
}

export default function Logo({ className }: Props) {
  return (
    <Link
      to="/"
      className={cn(
        'flex select-none items-center justify-center text-2xl font-bold text-neutral-900',
        className
      )}
    >
      <FileTextIcon size={32} className="mr-2 inline-block" />
      <span>Formify</span>
    </Link>
  );
}
