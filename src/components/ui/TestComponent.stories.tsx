import type { Meta, StoryObj } from '@storybook/react';
import TestComponent from './TestComponent';

/**
 * TestComponent renders a button that opens a modal with interactive text and buttons.
 * 
 * Features:
 * - Opens a modal dialog when clicked
 * - Interactive state changes within the modal
 * - Confirmation flow with "Ok" → "Yes" button progression
 */
const meta: Meta<typeof TestComponent> = {
  title: 'UI/TestComponent',
  component: TestComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'TestComponent renders a button that opens a modal with interactive text and buttons.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story showing the TestComponent with its modal functionality
 */
export const Default: Story = {};

/**
 * Interactive story demonstrating the full user flow
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Click the "Open Modal" button to see the interactive modal with state changes.',
      },
    },
  },
};