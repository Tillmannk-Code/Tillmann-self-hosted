import { Plus } from 'lucide-react'
import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { faqs } from '@/lib/content'

/**
 * Native <details> accordion — no client JS, works without hydration, and the
 * open/closed state is expressed in the DOM so screen readers and crawlers both
 * see every answer. The visible copy is the same string emitted in the FAQPage
 * JSON-LD, which is exactly what answer engines want to cite.
 */
export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 py-20 md:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading number="09" label="Questions people ask" />

        <ul className="bg-border grid grid-cols-1 gap-px">
          {faqs.map((faq) => (
            <li key={faq.question} className="bg-background">
              <details className="group">
                <summary className="hover:bg-surface flex cursor-pointer list-none items-start justify-between gap-6 p-6 transition-colors md:p-8 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-lg font-bold tracking-tight text-balance md:text-xl">
                    {faq.question}
                  </h3>
                  <Plus
                    aria-hidden
                    className="text-accent mt-1 size-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="text-muted-foreground max-w-3xl px-6 pb-6 leading-relaxed text-pretty md:px-8 md:pb-8">
                  {faq.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
