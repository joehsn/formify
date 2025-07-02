import { cn } from '@/lib/utils';
import React, { useRef, useEffect, useCallback } from 'react';

interface EditableDivProps extends React.HTMLAttributes<HTMLDivElement> {
  initialValue?: string;
  placeholder?: string;
  onContentChange?: (content: string) => void;
  className?: string;
}

const EditableDiv: React.FC<EditableDivProps> = ({
  initialValue = '',
  placeholder = '',
  onContentChange,
  className = '',
  ...rest
}) => {
  const contentRef = useRef<HTMLElement>(null);

  // Set initial content when the component mounts or initialValue changes
  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== initialValue) {
      contentRef.current.textContent = initialValue;
    }
  }, [initialValue]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (contentRef.current) {
      // Get plain text content. If you need rich text, use innerHTML and sanitize.
      const newContent = contentRef.current.textContent || '';
      onContentChange?.(newContent);
    }
  }, [onContentChange]);

  // Handle paste to strip rich text if desired
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLElement>) => {
      event.preventDefault();
      const text = event.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    },
    []
  );

  const handleBlur = useCallback(() => {
    // Optional: Clean up empty div content if user types spaces and deletes
    if (contentRef.current && contentRef.current.textContent?.trim() === '') {
      contentRef.current.innerHTML = '';
      // Also trigger content change to reflect actual emptiness
      onContentChange?.('');
    }
  }, [onContentChange]);

  return React.createElement('div', {
    ref: contentRef,
    contentEditable: 'true',
    suppressContentEditableWarning: true, // Suppress React's warning about contentEditable
    onInput: handleInput,
    onPaste: handlePaste,
    onBlur: handleBlur,
    className: cn(
      'editable leading-normal font-normal whitespace-pre-wrap break-words border-b outline-none focus:border-neutral-900 relative pt-6 pb-2',
      'before:content-[attr(data-placeholder)] before:absolute before:font-normal before:left-2 before:top-4',
      'focus:before:left-0 focus:before:top-1 focus:before:text-xs focus:before:text-muted-foreground',
      className
    ),
    'data-placeholder': placeholder,
    role: 'textbox',
    'aria-label': placeholder, // Use placeholder as aria-label for accessibility
    ...rest, // Pass through any other props like id, test-id etc.
  });
};

export default EditableDiv;
