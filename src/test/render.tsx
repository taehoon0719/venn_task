import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import type { ReactElement, ReactNode } from 'react';

export const renderWithRouter = (ui: ReactElement, route = '/') => {
  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  );
  return render(ui, { wrapper: Wrapper });
};
