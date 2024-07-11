import { render } from '@testing-library/react';

import { PostsList } from '../../src/server';

describe('PostsList', () => {
  const { mockPosts } = getTestData();

  it('should render component', () => {
    const { baseElement } = render(<PostsList posts={mockPosts} />);

    expect(baseElement).toBeInTheDocument();
  });

  it('should render list and list items', () => {
    const { getByRole, getAllByRole } = render(<PostsList posts={mockPosts} />);

    expect(getByRole('list')).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(mockPosts.length);
  });
});

function getTestData() {
  const mockPosts = [
    {
      userId: 1,
      id: 1,
      title: 'One',
      body: 'One content',
    },
    {
      userId: 1,
      id: 2,
      title: 'Two',
      body: 'Two content',
    },
    {
      userId: 1,
      id: 3,
      title: 'Three',
      body: 'Three content',
    },
  ];

  return {
    mockPosts,
  };
}
