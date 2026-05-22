import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gisellesilvajoias.com.br";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/favoritos`, lastModified: now, changeFrequency: "never", priority: 0.3 },
    { url: `${siteUrl}/orcamento`, lastModified: now, changeFrequency: "never", priority: 0.4 },
  ];

  // TODO: Fetch product slugs from Supabase and add dynamic routes
  // const products = await getActiveProducts();
  // const productRoutes = products.map(p => ({
  //   url: `${siteUrl}/produto/${p.slug}`,
  //   lastModified: p.created_at,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));

  return staticRoutes;
}
