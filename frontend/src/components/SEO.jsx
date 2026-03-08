import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, keywords }) {
    const location = useLocation();

    const defaultTitle = "Brian Dang - Software Engineer";
    const defaultDescription = "Software engineer specializing in gameplay systems, full-stack development, and creating unforgettable user experiences.";
    const defaultKeywords = "software engineer, gameplay engineer, full-stack developer, web development, system architecture";

    const pageTitle = title ? `${title} | Brian Dang` : defaultTitle;
    const pageDescription = description || defaultDescription;
    const pageKeywords = keywords || defaultKeywords;
    const canonicalUrl = `https://briandangdev.com${location.pathname}`;

    useEffect(() => {
        document.title = pageTitle;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = pageDescription;

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = pageKeywords;

        // Update Open Graph tags
        updateMetaTag('property', 'og:title', pageTitle);
        updateMetaTag('property', 'og:description', pageDescription);
        updateMetaTag('property', 'og:url', canonicalUrl);
        updateMetaTag('property', 'og:type', 'website');

        // Update Twitter Card tags
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', pageTitle);
        updateMetaTag('name', 'twitter:description', pageDescription);

        // Update canonical link
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
    }, [pageTitle, pageDescription, pageKeywords, canonicalUrl]);

    return null;
}

function updateMetaTag(attribute, value, content) {
    let tag = document.querySelector(`meta[${attribute}="${value}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, value);
        document.head.appendChild(tag);
    }
    tag.content = content;
}
