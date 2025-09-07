import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Workaround: temporarily change cwd so SvelteKit resolves correctly in Nx
function sveltekitFix() {
  const cwd = process.cwd();
  process.chdir(__dirname); // pretend to be in project root
  const plugin = sveltekit();
  process.chdir(cwd); // restore real cwd
  return plugin;
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekitFix(), // use the fixed version
  ],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          environment: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        },
      },
    ],
  },
});
