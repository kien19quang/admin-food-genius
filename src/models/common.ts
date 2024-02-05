import { MenuProps } from 'antd';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export type NextPageWithLayout = NextPage & {
  Layout?: (page: LayoutProps) => ReactElement;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export enum EGender {
  'Male',
  'Female',
}

export interface IconProps {
  className?: string;
  width?: number;
  height?: number;
}

export type MenuItem = Required<MenuProps>['items'][number];

export function getItem(label: React.ReactNode, key?: React.Key | null, icon?: React.ReactNode, style?: React.CSSProperties, children?: MenuItem[], type?: 'group'): MenuItem {
  return { key, icon, style, children, label, type } as MenuItem;
}