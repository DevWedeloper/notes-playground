import baseConfig from '../../.prettierrc.mjs';

/** @type {import("prettier").Config} */
export default {
  ...baseConfig,
  plugins: [...baseConfig.plugins, 'prettier-plugin-svelte'],
  overrides: [
    {
      files: '**/*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
};
