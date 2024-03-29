import ModalRestaurant from "@/components/Modals/ModalAddRestaurant"
import MainLayout from "@/layouts/MainLayout/MainLayout"
import { ICategory } from "@/models/Category/CategoryModel"
import { IRestaurant, RestaurantDto } from "@/models/Restaurant/RestaurantModel"
import RestaurantRepository from "@/services/Repositories/RestaurantRepository"
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Image, Modal, Typography, message, Table, Tooltip, Tag, TableColumnsType } from "antd"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


const { Title, Text } = Typography
const { confirm } = Modal
 
const Restaurant = () => {
  const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])
  const [openModalAddRestaurant, setOpenModalAddRestaurant] = useState<boolean>(false)
  const [idEditRestaurant, setIdEditRestaurant] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  
  const router = useRouter()

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListRestaurant()
  }, [])

  const fetchListRestaurant = async () => {
    setLoading(true)
    const users = await RestaurantRepository.getListRestaurant()
    setLoading(false)
    if (users) {
      setListRestaurant(users)
    }
  }

  const handleEditRestaurant = async (record: IRestaurant) => {
    setIdEditRestaurant(record._id);
    setOpenModalAddRestaurant(true);
    form.setFieldsValue({
      ...record,
      categoriesIds: record.categories.map(item => item._id),
      file: [{
        uid: record._id,
        status: 'done',
        url: record.image,
        src: record.image,
      }]
    });
  };

  const handleDeleteRestaurant = async (record: IRestaurant) => {
    confirm({
      title: 'Bạn có chắc muốn xoá nhà hàng này không?',
      onOk: async () => {
        const response = await RestaurantRepository.deleteRestaurant(record._id);
        if (response?.deletedCount) {
          setListRestaurant((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá nhà hàng thành công');
        }
      },
    });
  };

  const handleCancelModal = () => {
    setOpenModalAddRestaurant(false);
    setIdEditRestaurant('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: RestaurantDto) => {
        values.image = (values as any).file?.[0]?.src;
        delete (values as any).file
        const newListRestaurant = [...listRestaurant];
        if (!idEditRestaurant) {
          const restaurant = await RestaurantRepository.createRestaurant(values);
          if (restaurant) {
            newListRestaurant.push(restaurant)
          }
        } else {
          const restaurant = await RestaurantRepository.updateRestaurant(idEditRestaurant, values);
          if (restaurant) {
            const index = newListRestaurant.findIndex((item) => item._id === restaurant._id);
            newListRestaurant[index] = restaurant;
          }
        }
        message.success(idEditRestaurant ? 'Cập nhật nhà hàng thành công' : 'Thêm nhà hàng thành công');
        setListRestaurant(newListRestaurant);
        setOpenModalAddRestaurant(false);
        setIdEditRestaurant('');
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
  }

  const columns: TableColumnsType<IRestaurant> = [
    {
      title: 'Tên nhà hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: value => <Image src={value} alt="Ảnh nhà hàng" width={40} height={40} style={{ objectFit: 'cover' }} />,
      width: 80
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categories',
      render: (value: ICategory[]) => {
        if (!value.length) {
          return "--"
        }
        return (
          <Flex>
            {value.map(item => {
              return (
                <Tag key={item._id}>
                  {item.title}
                </Tag>
              )
            })}
          </Flex>
        )
      },
      ellipsis: true
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Tooltip title='Quản lý nhà hàng' placement='top'>
              <Button type='primary' icon={<EyeOutlined />} onClick={() => router.push({ pathname: `restaurant/${record._id}` })}/>
            </Tooltip>
            <Button icon={<EditOutlined />} onClick={() => handleEditRestaurant(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteRestaurant(record)} />
          </Flex>
        );
      },
      width: 180,
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
              Danh sách nhà hàng
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddRestaurant(true)}>
              Thêm nhà hàng
            </Button>
          </Flex>
          <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listRestaurant} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalRestaurant form={form} open={openModalAddRestaurant} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditRestaurant ? 'edit' : 'create'} />
    </>
  )
}

Restaurant.Layout = MainLayout

export default Restaurant