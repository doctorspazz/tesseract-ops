// astro.config.mjs
//
// Two integrations matter for this design:
//   - @astrojs/mdx — lets .mdx posts use <Callout> etc.
//   - astro-expressive-code — gives us filename headers + line numbers + a
//     proper theme on every ```bash title="…"``` code block.
//
// Install:
//   npx astro add mdx
//   npx astro add astro-expressive-code

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://tesseract-ops.dev', // adjust to your actual host
  integrations: [
    expressiveCode({
      // The site has both light + dark surfaces but code blocks stay dark in both.
      // Pick a single dark theme to keep code looking consistent.
      themes: ['github-dark'],
      defaultProps: {
        showLineNumbers: true,
        wrap: false,
      },
      styleOverrides: {
        codeFontFamily: 'var(--font-mono)',
        uiFontFamily:   'var(--font-mono)',
        borderRadius:   '0',
        borderColor:    'var(--rule)',
        codeBackground: '#06070a',
        frames: {
          editorTabBarBackground:        'rgba(255, 255, 255, 0.04)',
          editorTabBarBorderBottomColor: 'rgba(255, 255, 255, 0.08)',
          terminalBackground:            '#06070a',
          terminalTitlebarBackground:    'rgba(255, 255, 255, 0.04)',
          terminalTitlebarBorderBottomColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    }),
    mdx(),
  ],
  adapter: cloudflare(),
});
