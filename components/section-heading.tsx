import { cn } from '@/lib/utils'

/**
 * Section opener: a small mono kicker (the semantic h2) with an optional
 * oversized display line beneath it. The number is kept as a quiet index.
 */
export function SectionHeading({
  number,
  label,
  title,
  className,
}: {
  number?: string
  label: string
  title?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center gap-3">
        <span aria-hidden className="bg-accent size-1.5 rounded-full" />
        <h2 className="eyebrow text-muted-foreground">{label}</h2>
        {number ? (
          <span aria-hidden className="eyebrow text-muted-foreground/40">
            {number}
          </span>
        ) : null}
      </div>
      {title ? (
        <p className="display max-w-5xl text-[clamp(2.5rem,6.5vw,5.75rem)] text-balance">
          {title}
        </p>
      ) : null}
    </div>
  )
}
