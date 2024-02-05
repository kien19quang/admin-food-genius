import { Avatar, Dropdown, Input, Layout, MenuProps, Modal, Row, Tooltip, Typography } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { MenuInfo } from 'rc-menu/lib/interface';
import { CaretDownIcon, GearSix, SignOutIcon, UserIcon } from '../../components/Icons';
import { stringToColor } from '../../utils';
import { useRouter } from 'next/router';

const { Header } = Layout;
const { Text, Title } = Typography;
const { confirm } = Modal;

const items: MenuProps['items'] = [
  {
    label: (
      <Row align="middle" style={{ gap: 8, fontSize: 15 }}>
        <SignOutIcon width={18} height={18} /> Đăng xuất
      </Row>
    ),
    key: 'sign-out',
    danger: true,
  },
];

export interface HeaderMainLayoutProps {
  collapsed: boolean;
}

export default function HeaderMainLayout({ collapsed }: HeaderMainLayoutProps) {
  const { data } = useSession();
  const user = data?.user;
  const router = useRouter()

  const handleClickMenu = (info: MenuInfo) => {
    if (info.key === 'sign-out') {
      confirm({
        title: 'Bạn có muốn đăng xuất không?',
        onOk: () => {
          signOut({ redirect: true, callbackUrl: '/auth/signin' });
        },
      });
    }
    else if (info.key === 'profile') {
      router.push('/profile/info')
    }
  };

  return (
    <Header
      style={{
        height: 60,
        borderBottom: '1px solid #e1e5ea',
        borderLeft: '1px solid #e1e5ea',
        padding: '0 40px',
        position: 'fixed',
        top: 0,
        right: 0,
        left: collapsed ? 80 : 240,
        zIndex: 100,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        transition: 'all .3s cubic-bezier(.29,.01,0,1.04)',
      }}
    >
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Row>
          <Input style={{ width: 300 }} placeholder="Tìm kiếm trên WhatMovie" />
        </Row>
        <Row align="middle" style={{ gap: 24 }}>
          <Dropdown menu={{ items, style: { width: 200 }, onClick: handleClickMenu }} placement='bottomRight' arrow>
            <Row align="middle" style={{ cursor: 'pointer', gap: 12 }}>
              <Avatar style={{ backgroundColor: stringToColor(user?.name as string), cursor: 'pointer' }} size={32}>
                {user?.name?.at(0)}
              </Avatar>

              <Text style={{ fontSize: 16, fontWeight: 500 }}>{user?.name}</Text>

              <CaretDownIcon width={18} height={18} />
            </Row>
          </Dropdown>
        </Row>
      </Row>
    </Header>
  );
}
