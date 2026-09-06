import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'
import { projects } from '@/lib/content'

export function Projects() {
  return (
    <section
      id="work"
      className="bg-surface rule-t rule-b scroll-mt-16 py-20 md:py-28"
    >
      <Container className="flex flex-col gap-10">
        <SectionHeading number="05" label="Projects I loved" />

        <div className="flex flex-col">
          {projects.map((project) => (
            <article
              key={project.title}
              className="border-border flex flex-col gap-8 py-12 not-last:border-b lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:py-14"
            >
              <div className="flex flex-col gap-4 lg:max-w-2xl">
                <span className="eyebrow text-accent">
                  @ {project.client}
                </span>
                <h3 className="display text-[clamp(1.625rem,4.2vw,3rem)] text-balance">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {project.body}
                </p>
              </div>

              {project.metric ? (
                <div className="flex shrink-0 flex-col gap-3 lg:items-end lg:text-right">
                  <span className="text-accent text-[clamp(3rem,8.5vw,6.5rem)] leading-none font-bold tracking-tighter">
                    {project.metric}
                  </span>
                  <span className="eyebrow text-muted-foreground">
                    {project.metricLabel}
                  </span>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
