import { ClientWall } from '@/components/sections/client-wall'
import { Contact } from '@/components/sections/contact'
import { Faq } from '@/components/sections/faq'
import { Hero } from '@/components/sections/hero'
import { LatestWriting } from '@/components/sections/latest-writing'
import { Offerings } from '@/components/sections/offerings'
import { Positioning } from '@/components/sections/positioning'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Testimonials } from '@/components/sections/testimonials'
import { JsonLd } from '@/components/json-ld'
import { faqSchema, graph } from '@/lib/schema'

export default function HomePage() {
  return (
    <>
      {/* FAQPage lives here rather than in the layout: it is only true of the
          homepage, where the FAQ is actually rendered. */}
      <JsonLd data={graph(faqSchema())} />
      <Hero />
      <ClientWall />
      <Positioning />
      <Services />
      <Projects />
      <Offerings />
      <Testimonials />
      <LatestWriting />
      <Faq />
      <Contact />
    </>
  )
}
