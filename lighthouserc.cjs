module.exports = {
  ci: {
    collect: {
      url: [
        "https://thefourdeuces.nl/",
        "https://thefourdeuces.nl/book",
        "https://thefourdeuces.nl/artists",
        "https://thefourdeuces.nl/faq",
        "https://thefourdeuces.nl/about",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["warn", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "categories:seo": ["warn", { minScore: 0.85 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 500 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};