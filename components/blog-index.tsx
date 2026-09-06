'use client'

import { useMemo, useState } from 'react'
import { Container } from '@/components/container'
import { PostCard } from '@/components/post-card'
import { SectionHeading } from '@/components/section-heading'
import { TOPICS, type PostMeta, type Topic } from '@/lib/post-types'
import { cn } from '@/lib/utils'

type Filter = Topic | 'All'

const FILTERS: Filter[] = ['All', ...TOPICS]

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState<Filter>('All')

  const visible = useMemo(
    () => (active === 'All' ? posts : posts.filter((p) => p.topic === active)),
    [active, posts],
  )

  const countFor = (filter: Filter) =>
    filter === 'All'
      ? posts.length
      : posts.filter((p) => p.topic === filter).length

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <Container>
        <SectionHeading number="—" label="Writing" />

        <h1 className="display mt-10 text-5xl text-balance md:text-8xl">
          Notes from
          <br />
          <span className="text-accent">the work</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Opinions formed on real engagements — what actually moves retention,
          which dashboards get used, and where marketing operations quietly
          break.
        </p>

        {/* Topic filter */}
        <div
          role="tablist"
          aria-label="Filter posts by topic"
          className="rule-t mt-14 flex flex-wrap items-center gap-2 pt-8"
        >
          {FILTERS.map((filter) => {
            const isActive = filter === active
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter)}
                className={cn(
                  'eyebrow flex items-center gap-2 rounded-sm border px-4 py-2.5 transition-colors duration-200',
                  isActive
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-accent hover:text-accent',
                )}
              >
                {filter}
                <span className={isActive ? 'opacity-60' : 'opacity-40'}>
                  {countFor(filter)}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="rule-t py-16 text-center text-muted-foreground">
            Nothing here yet.
          </p>
        )}
      </Container>
    </div>
  )
}
