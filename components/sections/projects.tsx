import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/lib/content'

export function Projects() {
  return (
    <section id="work" className="scroll-mt-20 py-20 md:py-28">
      <Container className="flex flex-col gap-16">
        <SectionHeading label="Projects I loved" title="Results, not slide decks." />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group bg-surface border-foreground/5 hover:border-accent/50 relative flex min-h-[26rem] flex-col justify-between gap-12 overflow-hidden rounded-3xl border p-8 transition-colors duration-500 md:p-10"
            >
              {/* Accent wash that blooms on hover */}
              <div
                aria-hidden
                className="bg-accent/0 group-hover:bg-accent/10 pointer-events-none absolute inset-0 transition-colors duration-500"
              />

              <div className="relative flex items-center justify-between gap-4">
                <span className="eyebrow text-muted-foreground">@ {project.client}</span>
                <span className="eyebrow text-muted-foreground/60">{project.metricLabel}</span>
              </div>

              <p className="display text-accent glow relative text-[clamp(4.5rem,11vw,9rem)] tabular-nums">
                {project.metric}
              </p>

              <div className="relative flex flex-col gap-3">
                <h3 className="text-2xl font-normal tracking-tight text-balance">{project.title}</h3>
                <p className="text-muted-foreground max-w-md leading-relaxed text-pretty">
                  {project.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
