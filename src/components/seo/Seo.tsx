import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;
}

export const Seo = ({ title, description, canonical, image }: SeoProps) => {
  const { pathname } = useLocation();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = canonical || `${origin}${pathname}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
    </Helmet>
  );
};
