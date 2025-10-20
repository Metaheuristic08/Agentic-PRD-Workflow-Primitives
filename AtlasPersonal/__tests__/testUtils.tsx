import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

// Basic test utilities - will be enhanced as dependencies are added
// For now, this is a simple wrapper

interface TestProvidersProps {
  children: React.ReactNode;
}

const TestProviders: React.FC<TestProvidersProps> = ({ children }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestProviders, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
