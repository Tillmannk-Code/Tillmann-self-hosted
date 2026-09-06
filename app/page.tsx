import { ClientWall } from '@/components/sections/client-wall'
import { Contact } from '@/components/sections/contact'
import { Hero } from '@/components/sections/hero'
import { LatestWriting } from '@/components/sections/latest-writing'
import { Offerings } from '@/components/sections/offerings'
import { Positioning } from '@/components/sections/positioning'
import { Projects } from '@/components/sections/projects'
import { Services } from '@/components/sections/services'
import { Testimonials } from '@/components/sections/testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientWall />
      <Positioning />
      <Services />
      <Projects />
      <Offerings />
      <Testimonials />
      <LatestWriting />
      <Contact />
    </>
  )
}
