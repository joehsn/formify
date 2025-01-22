import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface Props extends React.HTMLProps<HTMLButtonElement> {
  handleClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const FAB = forwardRef<HTMLButtonElement, Props>(
  ({ handleClick, children, className }, ref) => (
    <Button
      ref={ref ? ref : null}
      onClick={handleClick}
      className={cn('fixed bottom-8 right-4 md:right-6', className)}
    >
      {children}
    </Button>
  )
);

export default FAB;
