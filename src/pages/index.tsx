import ModalAddUser from '@/components/Modals/ModalAddUser';
import ApiClient from '@/configs/axiosConfig';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { IRegisterDto } from '@/models/Auth/AuthTypes';
import { IUser } from '@/models/User/UserModel';
import UserRepository from '@/services/Repositories/UserRepository';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, Typography, message, Table, TableColumnsType } from 'antd'
import { DataSourceItemType } from 'antd/es/auto-complete';
import dayjs from 'dayjs';
import { InferGetServerSidePropsType, NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const { confirm } = Modal
const { Text, Title } = Typography

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [openModalAddUser, setOpenModalAddUser] = useState<boolean>(false);
  const [idEditUser, setIdEditUser] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchListUser()
  }, [])

  const fetchListUser = async () => {
    setLoading(true)
    const users = await UserRepository.getListUser()
    setLoading(false)
    if (users) {
      setListUser(users)
    }
  }

  const handleCancelModal = () => {
    setOpenModalAddUser(false);
    setIdEditUser('');
    form.resetFields();
  };

  const handleEditUser = async (record: IUser) => {
    setIdEditUser(record._id);
    setOpenModalAddUser(true);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
    });
  };

  const handleDeleteUser = async (record: IUser) => {
    confirm({
      title: 'Bạn có chắc muốn xoá tài khoản này không?',
      onOk: async () => {
        const response = await UserRepository.deleteUser(record._id);
        if (response?.deletedCount) {
          setListUser((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá tài khoản thành công');
        }
      },
    });
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: IRegisterDto) => {
        let newListUser = [...listUser];
        if (!idEditUser) {
          const user = await UserRepository.register(values);
          if (user) {
            newListUser = [user, ...newListUser];
          }
        } else {
          const user = await UserRepository.updateUser(idEditUser, values);
          if (user) {
            const index = newListUser.findIndex((item) => item._id === user._id);
            newListUser[index] = user;
          }
        }
        message.success(idEditUser ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản thành công');
        setListUser(newListUser);
        setOpenModalAddUser(false);
        setIdEditUser('');
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.error) {
          message.error(error?.response?.data?.error);
        } else {
          message.error('Vui lòng điền đầy đủ thông tin');
        }
      })
      .finally(() => {
        setLoadingConfirm(false);
      });
  };

  const columns: TableColumnsType<IUser> = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: value => dayjs(value).format('DD-MM-YYYY')
    },
    {
      title: 'Ngày cập nhật',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: value => dayjs(value).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record)} />
          </Flex>
        );
      },
      width: 120,
    },
  ];

  return (
    <>
      <Flex vertical style={{ width: '100%', height: '100%', padding: 24 }} justify="center" align="center">
        <Flex
          justify="center"
          vertical
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: 'white',
            boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
            gap: 24,
            maxWidth: 1200,
            width: '100%',
            margin: '0 40px'
          }}
        >
          <Flex justify="space-between" align="center">
            <Title level={3} style={{ margin: 0, fontSize: 20 }}>
              Danh sách người dùng
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddUser(true)}>
              Thêm tài khoản
            </Button>
          </Flex>
          <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listUser} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalAddUser form={form} open={openModalAddUser} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditUser ? 'edit' : 'create'} title="Tài khoản" />
    </>
  );
};

Home.Layout = MainLayout

export default Home

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}