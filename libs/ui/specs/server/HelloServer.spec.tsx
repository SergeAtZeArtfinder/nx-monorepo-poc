import { render } from '@testing-library/react';

import { HelloServer } from '../../src/server';

describe('HelloServer', () => {
  it('should render component', async () => {
    const { baseElement } = render(await HelloServer());

    expect(baseElement).toBeInTheDocument();
  });

  it('should render the heading', async () => {
    const { getByRole } = render(await HelloServer());
    const headingH1 = getByRole('heading', {
      level: 1,
    });

    expect(headingH1).toBeInTheDocument();
    expect(headingH1).toHaveTextContent('Hello Server');
  });
});
