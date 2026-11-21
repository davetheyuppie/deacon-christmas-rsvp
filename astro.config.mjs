// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://<user>.github.io/<repo>/
// If you rename the repo, change `base` to match.
export default defineConfig({
  site: 'https://davetheyuppie.github.io',
  base: '/deacon-christmas-rsvp',
  output: 'static',
});
