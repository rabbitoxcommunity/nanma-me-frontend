import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "Nanma Properties — Crafted Living, Built to Endure",
  description = "Nanma Properties designs and develops a small portfolio of luxury residences across across middle east — bespoke villas, sky homes, and limited-edition residential projects.",
  image = "https://nanmaconstruct.com/og-image.jpg",
  url = "https://nanmaconstruct.com",
  type = "website",
  schema,
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
