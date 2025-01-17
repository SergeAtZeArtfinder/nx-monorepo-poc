import { render } from '@testing-library/react';

import Posts from '../../../src/components/Posts';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Posts', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve([
          {
            userId: 1,
            id: 1,
            title: 'mock title',
            body: 'mock post content',
          },
        ]),
    });
  });
  it('should render successfully', async () => {
    const { baseElement } = render(await Posts());

    expect(baseElement).toBeInTheDocument();
  });

  it('should render list and list item', async () => {
    const { getAllByRole, getByRole } = render(await Posts());
    const list = getByRole('list');
    const listItems = getAllByRole('listitem');

    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(1);
  });
});
