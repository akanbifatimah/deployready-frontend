import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'DeployReady';
// Set VITE_SITE_URL in .env for production so canonical and share URLs are absolute.
const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

interface SeoOptions {
  /** Page title; the site name is appended unless this is the home page. */
  title?: string;
  description: string;
  /** Keep the page out of search results (e.g. 404). */
  noIndex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Updates the document title and the meta tags declared in index.html for the current route. */
export function useSeo({ title, description, noIndex = false }: SeoOptions) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Deployment checklists for React, Node.js & Python`;
    const url = `${SITE_URL}${pathname}`;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setCanonical(url);
  }, [title, description, noIndex, pathname]);
}
