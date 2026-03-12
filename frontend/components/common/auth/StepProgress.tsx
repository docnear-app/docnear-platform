import { cn } from '@/lib/utils';

interface StepProgressProps {
  current: number; // 1-based
  total: number;
  labels?: string[];
}

export function StepProgress({ current, total, labels }: StepProgressProps) {
  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < current;
          const isActive = step === current;
          return (
            <div
              key={step}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-300',
                isCompleted && 'bg-teal-500',
                isActive && 'bg-teal-600',
                !isCompleted && !isActive && 'bg-gray-100',
              )}
            />
          );
        })}
      </div>

      {/* Step label */}
      <p className="text-xs text-gray-400 font-medium">
        Step {current} of {total}
        {labels?.[current - 1] && <span className="text-gray-500"> — {labels[current - 1]}</span>}
      </p>
    </div>
  );
}
