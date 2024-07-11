import { render } from '@testing-library/react';

import { Demo } from '../../src';

describe('Demo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Demo />);

    expect(baseElement).toBeInTheDocument();
  });

  it('should render heading', () => {
    const { getByRole } = render(<Demo />);

    expect(
      getByRole('heading', {
        level: 1,
      })
    ).toBeInTheDocument();
  });
});
