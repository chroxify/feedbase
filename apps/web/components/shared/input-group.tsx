import { Input } from '@feedbase/ui/components/input';

export default function InputGroup({
  prefix,
  suffix,
  placeholder,
  value,
  onChange,
}: {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='bg-background focus-within:ring-ring ring-offset-root flex h-8 w-full rounded-md border text-sm transition-shadow duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-1'>
      {prefix ? (
        <div className='text-muted-foreground bg-accent flex select-none items-center justify-center rounded-l-md border-r px-3 py-2'>
          {prefix}
        </div>
      ) : null}
      <Input
        className='font-base h-full w-full border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {suffix ? (
        <div className='text-foreground/50 bg-accent flex select-none items-center justify-center rounded-r-md border-l px-3 py-2'>
          {suffix}
        </div>
      ) : null}
    </div>
  );
}
