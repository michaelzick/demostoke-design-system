import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.story.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      // Ensure no dev-mode scripts are injected in production
      config.plugins = config.plugins?.filter(
        plugin => plugin && typeof plugin === 'object' && 'name' in plugin && plugin.name !== 'vite:inject-mocker'
      );
    }
    return config;
  },
};

export default config;