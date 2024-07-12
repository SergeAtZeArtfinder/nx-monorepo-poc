import type { Meta, StoryObj } from '@storybook/react';
import { Demo } from './index';

const meta: Meta<typeof Demo> = {
  component: Demo,
  title: 'Demo',
};
export default meta;
type Story = StoryObj<typeof Demo>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
};
