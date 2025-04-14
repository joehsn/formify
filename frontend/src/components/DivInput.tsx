import React, { useEffect, useRef } from "react";

interface DivInputProps extends React.HTMLAttributes<HTMLElement> {
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
}

const DivInput: React.FC<DivInputProps> = ({
  value,
  setValue,
  disabled = false,
  ...props
}) => {
  const elRef = useRef<HTMLElement | null>(null);
  const lastValue = useRef(value);

  useEffect(() => {
    if (elRef.current && elRef.current.textContent !== value) {
      elRef.current.textContent = value;
    }
    lastValue.current = value;
  }, [value]);

  const handleInput = () => {
    if (!elRef.current) return;

    const newValue = elRef.current.textContent || "";
    if (newValue !== lastValue.current) {
      lastValue.current = newValue;
      setValue(newValue);
    }
  };

  const handleFocus = () => {
    if (!elRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(elRef.current);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  return React.createElement("div", {
    ...props,
    ref: (el: HTMLElement | null) => (elRef.current = el),
    contentEditable: !disabled,
    suppressContentEditableWarning: true,
    onInput: handleInput,
    onBlur: handleInput,
    onFocus: handleFocus,
  });
};

export default DivInput;

