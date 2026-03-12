import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  optional = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('auth-field-group', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className={cn(error && 'text-red-600')}>
          {label}
          {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>}
        </Label>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
