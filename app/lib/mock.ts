import type { IDimensionBars, IStats, ITimeline } from "./models";

export function getStatsMock(): IStats {
  return {
    visitors: 756,
    visitorsGrowth: 12.5,
    views: 3254,
    viewsGrowth: 8.2,
  };
}

export function getTimelineMock(): ITimeline {
  return [
    { timestamp: new Date("2023-05-25"), visitors: 125, views: 342 },
    { timestamp: new Date("2023-05-26"), visitors: 143, views: 389 },
    { timestamp: new Date("2023-05-27"), visitors: 98, views: 267 },
    { timestamp: new Date("2023-05-28"), visitors: 87, views: 231 },
    { timestamp: new Date("2023-05-29"), visitors: 156, views: 412 },
    { timestamp: new Date("2023-05-30"), visitors: 178, views: 467 },
    { timestamp: new Date("2023-05-31"), visitors: 164, views: 432 },
  ];
}

export function getDimensionsMock(): IDimensionBars[] {
  return [
    {
      dimension: "ref",
      bars: [
        { value: "https://example.com", count: 100 },
        { value: "https://google.com", count: 85 },
        { value: "https://twitter.com", count: 72 },
        { value: "https://facebook.com", count: 68 },
        { value: "https://github.com", count: 54 },
        { value: "https://linkedin.com", count: 47 },
        { value: "https://reddit.com", count: 39 },
      ],
    },
    {
      dimension: "path",
      bars: [
        { value: "/home", count: 150 },
        { value: "/products", count: 120 },
        { value: "/about", count: 90 },
        { value: "/contact", count: 75 },
        { value: "/blog", count: 65 },
      ],
    },
    {
      dimension: "hash",
      bars: [
        { value: "#section1", count: 80 },
        { value: "#pricing", count: 65 },
        { value: "#features", count: 55 },
        { value: "#testimonials", count: 45 },
        { value: "#faq", count: 35 },
      ],
    },
    {
      dimension: "country",
      bars: [
        { value: "United States", count: 250 },
        { value: "United Kingdom", count: 180 },
        { value: "Canada", count: 150 },
        { value: "Germany", count: 120 },
        { value: "Australia", count: 100 },
      ],
    },
    {
      dimension: "region",
      bars: [
        { value: "California", count: 120 },
        { value: "New York", count: 100 },
        { value: "Texas", count: 85 },
        { value: "Florida", count: 70 },
        { value: "Washington", count: 60 },
      ],
    },
    {
      dimension: "city",
      bars: [
        { value: "New York", count: 95 },
        { value: "San Francisco", count: 85 },
        { value: "London", count: 75 },
        { value: "Toronto", count: 65 },
        { value: "Berlin", count: 55 },
      ],
    },
    {
      dimension: "timezone",
      bars: [
        { value: "America/New_York", count: 200 },
        { value: "America/Los_Angeles", count: 180 },
        { value: "Europe/London", count: 150 },
        { value: "Europe/Berlin", count: 120 },
        { value: "Australia/Sydney", count: 90 },
      ],
    },
    {
      dimension: "browser",
      bars: [
        { value: "Chrome", count: 350 },
        { value: "Safari", count: 250 },
        { value: "Firefox", count: 150 },
        { value: "Edge", count: 100 },
        { value: "Opera", count: 50 },
      ],
    },
    {
      dimension: "browser_version",
      bars: [
        { value: "Chrome 112.0", count: 200 },
        { value: "Safari 16.4", count: 150 },
        { value: "Firefox 112.0", count: 100 },
        { value: "Edge 112.0", count: 80 },
        { value: "Chrome 111.0", count: 70 },
      ],
    },
    {
      dimension: "os",
      bars: [
        { value: "Windows", count: 300 },
        { value: "macOS", count: 250 },
        { value: "iOS", count: 200 },
        { value: "Android", count: 150 },
        { value: "Linux", count: 100 },
      ],
    },
    {
      dimension: "os_version",
      bars: [
        { value: "Windows 11", count: 180 },
        { value: "macOS 13.3", count: 150 },
        { value: "iOS 16.4", count: 120 },
        { value: "Android 13", count: 100 },
        { value: "Windows 10", count: 90 },
      ],
    },
    {
      dimension: "device",
      bars: [
        { value: "Desktop", count: 400 },
        { value: "Mobile", count: 300 },
        { value: "Tablet", count: 100 },
        { value: "Smart TV", count: 30 },
        { value: "Console", count: 20 },
      ],
    },
    {
      dimension: "locale",
      bars: [
        { value: "en-US", count: 300 },
        { value: "en-GB", count: 150 },
        { value: "de-DE", count: 100 },
        { value: "fr-FR", count: 80 },
        { value: "es-ES", count: 70 },
      ],
    },
    {
      dimension: "utm_source",
      bars: [
        { value: "google", count: 200 },
        { value: "facebook", count: 150 },
        { value: "twitter", count: 100 },
        { value: "newsletter", count: 80 },
        { value: "linkedin", count: 70 },
      ],
    },
    {
      dimension: "utm_medium",
      bars: [
        { value: "cpc", count: 180 },
        { value: "social", count: 150 },
        { value: "email", count: 120 },
        { value: "organic", count: 100 },
        { value: "referral", count: 90 },
      ],
    },
    {
      dimension: "utm_campaign",
      bars: [
        { value: "spring_sale", count: 150 },
        { value: "product_launch", count: 120 },
        { value: "brand_awareness", count: 100 },
        { value: "newsletter_may", count: 80 },
        { value: "retargeting", count: 70 },
      ],
    },
  ];
}
