import { LayoutProps } from '@/models/common';

const EmptyLayout = ({ children }: LayoutProps): JSX.Element => {
  return <div>{children}</div>;
};

export default EmptyLayout;
