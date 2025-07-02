import { Link } from 'react-router-dom';
import { FileText as FileTextIcon } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  className?: string;
}

export default function Logo({ className }: Props) {
  return (
    <Link
      to="/"
      className={clsx(
        'flex select-none items-center gap-2 justify-center text-2xl p-4 font-bold text-neutral-900',
        className
      )}
    >
      <FileTextIcon size={32} />
      <span>Formify</span>
    </Link>
  );
}
