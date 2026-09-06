import { cn } from '@/lib/utils'

/**
 * Mono section marker — `01 / SERVICES` above a hairline rule.
 * Carries the "technical" half of the design language.
 */
export function SectionHeading({
  number,
  label,
  className,
}: {
  number: string
  label: string
  className?: string
}) {
  return (
    <div className={cn('rule-b flex items-center gap-3 pb-4', className)}>
      <span className="eyebrow text-accent">{number}</span>
      <span aria-hidden className="text-muted-foreground/40 eyebrow">
        /
      </span>
      <h2 className="eyebrow text-muted-foreground">{label}</h2>
    </div>
  )
}
