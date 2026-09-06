import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'outline'

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-sans text-xs font-medium uppercase tracking-[0.06em] transition-colors duration-200'

const variants: Record<Variant, string> = {
  solid:
    'bg-accent text-accent-foreground hover:bg-accent/85 px-5 py-3 font-semibold',
  outline:
    'border border-border text-foreground hover:border-accent hover:text-accent px-5 py-3',
}

export function Cta({
  href,
  variant = 'solid',
  className,
  children,
  ...rest
}: {
  href: string
  variant?: Variant
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:')

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(base, variants[variant], className)}
        {...(href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  )
}
