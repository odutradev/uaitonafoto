import { useEffect } from "react";

import { getSeoPage, siteName } from "@assets/data/seo";
import type { SeoPageKey } from "@assets/data/seo";

// Mantém o título da aba igual ao título de SEO da página ao navegar pelo SPA.
const usePageTitle = (key: SeoPageKey) => {
  useEffect(() => {
    document.title = getSeoPage(key).title;
    return () => {
      document.title = siteName;
    };
  }, [key]);
};

export default usePageTitle;
