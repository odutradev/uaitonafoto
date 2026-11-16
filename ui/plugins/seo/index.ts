import fs from "fs";
import path from "path";

import {
  faqItems,
  ogImage,
  organization,
  seoDisallowedPaths,
  seoPages,
  seoPlans,
  siteLocale,
  siteName,
  siteUrl,
  themeColor
} from "../../src/assets/data/seo";
import type { SeoPage } from "../../src/assets/data/seo";

import type { Plugin, ResolvedConfig } from "vite";

const headStart = "<!--seo:head:start-->";
const headEnd = "<!--seo:head:end-->";
const contentMarker = "<!--seo:content-->";
const headPlaceholder = "<!--seo:head-->";
const shellFile = "200.html";

type JsonLd = Record<string, unknown>;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const absoluteUrl = (pathname: string) => (pathname === "/" ? `${siteUrl}/` : `${siteUrl}${pathname}`);

const buildLandingJsonLd = (): JsonLd[] => {
  const organizationId = `${siteUrl}/#organization`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: organization.name,
      legalName: organization.legalName,
      taxID: organization.taxId,
      url: `${siteUrl}/`,
      logo: absoluteUrl(organization.logoPath),
      ...(organization.socialProfiles.length > 0 ? { sameAs: organization.socialProfiles } : {})
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: `${siteUrl}/`,
      inLanguage: "pt-BR",
      publisher: { "@id": organizationId }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: siteName,
      url: `${siteUrl}/`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      inLanguage: "pt-BR",
      description: seoPages[0].description,
      image: absoluteUrl(ogImage.path),
      publisher: { "@id": organizationId },
      offers: seoPlans.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.price.toFixed(2),
        priceCurrency: "BRL",
        description: plan.description,
        url: `${siteUrl}/#planos`,
        ...(plan.billing === "mês"
          ? {
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: plan.price.toFixed(2),
                priceCurrency: "BRL",
                unitCode: "MON",
                referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" }
              }
            }
          : {})
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ];
};

const buildBreadcrumbJsonLd = (page: SeoPage): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: siteName, item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: page.heading, item: absoluteUrl(page.path) }
  ]
});

const buildHead = (page: SeoPage | null) => {
  const title = page?.title ?? siteName;
  const description = page?.description ?? seoPages[0].description;
  const url = page ? absoluteUrl(page.path) : `${siteUrl}/`;
  const imageUrl = absoluteUrl(ogImage.path);
  const robots = page?.isIndexable ? "index, follow, max-image-preview:large" : "noindex, nofollow";
  const jsonLd = page ? (page.key === "landing" ? buildLandingJsonLd() : [buildBreadcrumbJsonLd(page)]) : [];

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    ...(page ? [`<link rel="canonical" href="${url}" />`] : []),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${siteName}" />`,
    `<meta property="og:locale" content="${siteLocale}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    `<meta property="og:image:width" content="${ogImage.width}" />`,
    `<meta property="og:image:height" content="${ogImage.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(ogImage.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${imageUrl}" />`,
    ...jsonLd.map(
      (item) => `<script type="application/ld+json">${JSON.stringify(item).replace(/</g, "\\u003c")}</script>`
    )
  ];

  return [headStart, ...tags, headEnd].map((tag) => `    ${tag}`).join("\n");
};

const buildNavigation = () => {
  const links = seoPages
    .filter((page) => page.isIndexable)
    .map((page) => `<li><a href="${page.path}">${escapeHtml(page.heading)}</a></li>`)
    .join("");
  return `<nav aria-label="Páginas"><ul>${links}</ul></nav>`;
};

// Conteúdo real da página em HTML puro. Aparece para buscadores e redes sociais que não executam
// JavaScript e é substituído pelo React assim que o app monta.
const buildContent = (page: SeoPage) => {
  const sections = page.sections
    .map((section) => {
      const items = section.items?.length
        ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";
      return `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p>${items}</section>`;
    })
    .join("");

  const faq =
    page.key === "landing"
      ? `<section><h2>Perguntas frequentes</h2>${faqItems
          .map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`)
          .join("")}</section>`
      : "";

  const cta =
    page.key === "landing" ? `<p><a href="/signup">Criar meu evento</a> · <a href="/signin">Entrar</a></p>` : "";

  return [
    `<div class="seo-static">`,
    `<header><a href="/">${siteName}</a></header>`,
    `<main><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.intro)}</p>${cta}${sections}${faq}</main>`,
    `<footer>${buildNavigation()}<p>© ${organization.legalName} · CNPJ ${organization.taxId}</p></footer>`,
    `</div>`
  ].join("");
};

const replaceHead = (html: string, head: string) => {
  const start = html.indexOf(headStart);
  const end = html.indexOf(headEnd);
  if (start === -1 || end === -1) throw new Error("[seo] head markers not found in index.html");
  const lineStart = html.lastIndexOf("\n", start) + 1;
  return html.slice(0, lineStart) + head + html.slice(end + headEnd.length);
};

const replaceContent = (html: string, content: string) => {
  const rootPattern = /<div id="root">[\s\S]*?<\/div>\s*(?=<script|<\/body>)/;
  if (!rootPattern.test(html)) throw new Error("[seo] root element not found in index.html");
  return html.replace(rootPattern, `<div id="root">${content}</div>\n    `);
};

const buildSitemap = () => {
  const lastModified = new Date().toISOString().slice(0, 10);
  const urls = seoPages
    .filter((page) => page.isIndexable)
    .map(
      (page) =>
        `  <url>\n    <loc>${absoluteUrl(page.path)}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>${page.changeFrequency}</changefreq>\n    <priority>${page.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const buildRobots = () =>
  [
    "User-agent: *",
    "Allow: /",
    ...seoDisallowedPaths.map((pathname) => `Disallow: ${pathname}`),
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ""
  ].join("\n");

const buildManifest = () =>
  JSON.stringify(
    {
      name: siteName,
      short_name: siteName,
      description: seoPages[0].description,
      lang: "pt-BR",
      start_url: "/",
      display: "standalone",
      background_color: "#FBF8F1",
      theme_color: themeColor,
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
      ]
    },
    null,
    2
  );

const seoPlugin = (): Plugin => {
  let config: ResolvedConfig;
  const landing = seoPages.find((page) => page.key === "landing") ?? null;

  return {
    name: "uaitonafoto-seo",
    configResolved(resolved) {
      config = resolved;
    },
    transformIndexHtml(html) {
      const withHead = html.replace(headPlaceholder, buildHead(landing).trimStart());
      if (config.command !== "build" || !landing) return withHead;
      return withHead.replace(contentMarker, buildContent(landing));
    },
    closeBundle() {
      if (config.command !== "build") return;
      const outDir = path.resolve(config.root, config.build.outDir);
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const baseHtml = fs.readFileSync(indexPath, "utf-8");

      for (const page of seoPages) {
        if (page.key === "landing") continue;
        const html = replaceContent(replaceHead(baseHtml, buildHead(page)), buildContent(page));
        fs.writeFileSync(path.join(outDir, page.file), html);
      }

      // Casca do SPA usada como fallback do nginx (painel, convidados, telões e 404): nunca indexada.
      fs.writeFileSync(path.join(outDir, shellFile), replaceContent(replaceHead(baseHtml, buildHead(null)), ""));
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemap());
      fs.writeFileSync(path.join(outDir, "robots.txt"), buildRobots());
      fs.writeFileSync(path.join(outDir, "site.webmanifest"), buildManifest());
    }
  };
};

export default seoPlugin;
