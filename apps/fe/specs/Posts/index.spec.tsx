import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Posts from '../../src/components/Posts';

const mockFetch = jest.fn();
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
});
