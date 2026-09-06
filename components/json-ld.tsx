/**
 * Renders JSON-LD into the server-rendered HTML.
 *
 * A plain <script> in an RSC is the approach Next documents for structured
 * data: it lands in the initial payload, so crawlers that never run JavaScript
 * still see it. The `<` escape prevents a string in the data from closing the
 * script tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
