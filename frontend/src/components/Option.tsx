type OptionProps = {
  option: string;
  index: number;
  fieldType: 'radio' | 'checkbox' | 'dropdown';
  onOptionChange: (newOption: string) => void;
};

function Option({
  option,
  index,
  fieldType,
  onOptionChange,
}: OptionProps) {
  return (
    <div className="flex w-full items-center space-x-2">
      {fieldType === 'radio' ? (
        <div className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
      ) : fieldType === 'checkbox' ? (
        <div className="peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
      ) : (
        <div>{index + 1}.</div>
      )}
      <input
        type="text"
        value={option}
        onChange={(e) => onOptionChange(e.target.value)}
        className="w-full border-b py-1 outline-none focus:border-neutral-900"
      />
    </div>
  );
}

export default Option;
