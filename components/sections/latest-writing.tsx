import { Container } from '@/components/container'
import { Cta } from '@/components/cta'
import { PostCard } from '@/components/post-card'
import { SectionHeading } from '@/components/section-heading'
import { getAllPosts } from '@/lib/posts'

export function LatestWriting() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section id="writing" className="py-20 md:py-28">
      <Container>
        <SectionHeading number="08" label="Writing" />

        <p className="display mt-10 text-4xl text-balance md:text-6xl">
          Notes from the work
        </p>

        <div className="mt-12">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="rule-t pt-8">
          <Cta href="/blog" variant="outline">
            All writing
          </Cta>
        </div>
      </Container>
    </section>
  )
}
