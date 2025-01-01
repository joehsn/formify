import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { FaFileLines } from 'react-icons/fa6';

interface Props {
  className?: string;
}

export default function Logo({ className }: Props) {
  return (
    <Link
      to="/"
      className={cn(
        'flex items-center justify-center select-none text-2xl font-bold text-neutral-900',
        className
      )}
    >
      <FaFileLines size={32} className="inline-block mr-2" />
      <span className="hidden sm:inline">Formify</span>
    </Link>
  );
}
