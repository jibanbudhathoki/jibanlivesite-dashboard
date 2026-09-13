export interface SiteSettings {
  siteUrl?: string;
  seoTitle?: string;
  titleTemplate?: string;
  seoDescription?: string;
  keywords?: string;
  ogImageUrl?: string | null;
  faviconUrl?: string | null;
  appleTouchIconUrl?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  twitterHandle?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  indexingEnabled?: boolean;
}

export type UpdateSiteSettingsPayload = SiteSettings;

