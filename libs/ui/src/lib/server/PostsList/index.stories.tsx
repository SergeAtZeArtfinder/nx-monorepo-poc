import type { Meta, StoryObj } from '@storybook/react';

import { mock } from '@nx-monorepo-polygon/utils';
import { PostsList } from './index';

const meta: Meta<typeof PostsList> = {
  component: PostsList,
  title: 'PostsList',
};

export default meta;
type Story = StoryObj<typeof PostsList>;

export const Primary = {
  args: {
    posts: mock.posts,
  },
};

export const Heading: Story = {
  args: {
    posts: mock.posts,
  },
};
