import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisualRegressionTestSuite } from './VisualRegressionTestSuite';

const meta: Meta<typeof VisualRegressionTestSuite> = {
  title: 'Testing/Visual Regression Suite',
  component: VisualRegressionTestSuite,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive visual regression testing suite for DemoStoke design tokens and brand consistency.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
