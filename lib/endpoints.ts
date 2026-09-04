const API_VERSION = "/v1";
const ADMIN_PREFIX = `${API_VERSION}/admin`;

export const endpoints = {
  auth: {
    setup: `${ADMIN_PREFIX}/auth/setup`,
    login: `${ADMIN_PREFIX}/auth/login`,
    me: `${ADMIN_PREFIX}/auth/me`,
  },
  profile: `${ADMIN_PREFIX}/profile`,
  skills: `${ADMIN_PREFIX}/skills`,
  experience: `${ADMIN_PREFIX}/experience`,
  education: `${ADMIN_PREFIX}/education`,
  services: `${ADMIN_PREFIX}/services`,
  faqs: `${ADMIN_PREFIX}/faqs`,
  projects: `${ADMIN_PREFIX}/projects`,
  posts: `${ADMIN_PREFIX}/posts`,
  testimonials: `${ADMIN_PREFIX}/testimonials`,
  socials: `${ADMIN_PREFIX}/socials`,
  settings: `${ADMIN_PREFIX}/settings`,
  media: `${ADMIN_PREFIX}/media`,
  messages: `${ADMIN_PREFIX}/messages`,
};
