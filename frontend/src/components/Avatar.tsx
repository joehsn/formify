import useUserStore from '@/lib/stores/user.store';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

function Avatar({ className }: Props) {
  const user = useUserStore((state) => state.user);
  const letter = user?.fullname[0].toUpperCase();
  return (
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800 select-none',
          className
        )}
      >
        {letter}
      </div>
  );
}

export default Avatar;
