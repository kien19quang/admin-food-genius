import ModalDish from "@/components/Modals/ModalAddDish"
import MainLayout from "@/layouts/MainLayout/MainLayout"
import { IOrder } from "@/models/Order/Order"
import { DishDto, IDish, IRestaurant } from "@/models/Restaurant/RestaurantModel"
import { IUser } from "@/models/User/UserModel"
import OrderRepository from "@/services/Repositories/OrderRepository"
import RestaurantRepository from "@/services/Repositories/RestaurantRepository"
import { DeleteOutlined, EditOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons"
import { Avatar, Button, Divider, Flex, Form, Image, Modal, Spin, Table, TableColumnsType, Tabs, TabsProps, Tag, Typography, message } from "antd"
import dayjs from "dayjs"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const { Title, Text } = Typography
const { confirm } = Modal

const RestaurantDetail = () => {
  const router = useRouter()
  const idRestaurant = router.query?.id as string

  const [restaurant, setRestaurant] = useState<IRestaurant>()
  const [openModalAddDish, setOpenModalAddDish] = useState<boolean>(false)
  const [idEditDish, setIdEditDish] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false)
  const [activeKey, setActiveKey] = useState<string>('dishes')
  const [listOrder, setListOrder] = useState<IOrder[]>([])
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false)

  const [form] = Form.useForm()

  useEffect(() => {
    if (idRestaurant) {
      handleGetDetailRestaurant()
      handleGetOrder()
    }
  }, [idRestaurant])

  const handleGetDetailRestaurant = async () => {
    setLoading(true)
    const response = await RestaurantRepository.getDetailRestaurant(idRestaurant)
    setLoading(false)
    setRestaurant(response)
  }

  const handleGetOrder = async () => {
    setLoadingOrder(true)
    const response = await OrderRepository.getListOrder(idRestaurant)
    setLoadingOrder(false)
    if (response) {
      setListOrder(response)
    }
  }

  const handleCancelModal = () => {
    setOpenModalAddDish(false);
    setIdEditDish('');
    form.resetFields();
  };

  const handleSubmit = () => {
    if (restaurant?._id) {
      setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: DishDto) => {
        values.image = (values as any).file?.[0]?.src;
        delete (values as any).file
        const newRestaurant = { ...restaurant }
        if (!idEditDish) {
          const dish = await RestaurantRepository.createDish({ ...values, restaurantId: restaurant._id });
          if (dish) {
            newRestaurant.dishes?.push(dish)
          }
        } else {
          const dish = await RestaurantRepository.updateDish(idEditDish, { ...values, restaurantId: restaurant._id });
          if (dish) {
            const index = newRestaurant.dishes?.findIndex((item) => item._id === dish._id);
            newRestaurant.dishes[index] = dish;
          }
        }
        message.success(idEditDish ? 'Cập nhật món ăn thành công' : 'Thêm món ăn thành công');
        setRestaurant(newRestaurant);
        setOpenModalAddDish(false);
        setIdEditDish('');
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
  }

  const handleEditDish = async (record: IDish) => {
    setIdEditDish(record._id);
    setOpenModalAddDish(true);
    form.setFieldsValue({
      ...record,
      file: [{
        uid: record._id,
        status: 'done',
        url: record.image,
        src: record.image,
      }]
    });
  }

  const handleDeleteDish = async (record: IDish) => {
    confirm({
      title: 'Bạn có chắc muốn xoá món ăn này không?',
      onOk: async () => {
        if (restaurant) {
          const response = await RestaurantRepository.deleteDish(record._id);
          if (response?.deletedCount) {
            const newRestaurant = { ...restaurant }
            newRestaurant.dishes = restaurant?.dishes.filter(item => item._id !== record._id)
            setRestaurant(newRestaurant)
            message.success('Xoá món ăn thành công');
          }
        }
      },
    });
  }

  const columnsDish: TableColumnsType<IDish> = [
    {
      title: 'Tên món ăn',
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: value => `${value}$`,
      width: 100
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditDish(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteDish(record)} />
          </Flex>
        );
      },
      width: 120,
    },
  ];

  const columnsOrder: TableColumnsType<IOrder> = [
    {
      title: 'Mã giao dịch',
      dataIndex: '_id'
    },
    { 
      title: 'Nhà hàng',
      dataIndex: 'restaurant',
      render: (value: IRestaurant) => value?.name
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      render: (value: IUser) => value?.name
    },
    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      render: value => value ? <Tag color='success'>Đã thanh toán</Tag> : <Tag color='error'>Chưa thanh toán</Tag>
    },
    {
      title: 'Vận chuyển',
      dataIndex: 'isShipped',
      render: value => value ? <Tag color='success'>Đã vận chuyển</Tag> : <Tag color='error'>Chưa vận chuyển</Tag>
    },
  ]

  const items: TabsProps['items'] = [
    {
      key: 'dishes',
      label: 'Các món ăn',
      children: (
        <Flex vertical gap={16}>
          <Flex justify='end' align='center'>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => setOpenModalAddDish(true)}>Thêm món ăn</Button>
          </Flex>

          <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columnsDish} dataSource={[...restaurant?.dishes || []]} bordered={false} style={{ width: '100%' }} />
        </Flex>
      ),
    },
    {
      key: 'order',
      label: 'Hoá đơn',
      children: <Table loading={loadingOrder} columns={columnsOrder} dataSource={listOrder} bordered={false} style={{ width: '100%' }} />,
    }
  ];

  return (
    <>
      <Flex vertical style={{ width: '100%', height: '100%', padding: 24 }} gap={24}>
        <Flex gap={12} style={{ cursor: 'pointer' }} onClick={() => router.push({ pathname: '/restaurant' })} className="hover-color-primary">
          <LeftOutlined />
          <Text style={{ color: 'inherit' }}>Nhà hàng</Text>
        </Flex>
  
        <Flex gap={24}>
          <Spin spinning={loading}>
            <Flex style={{ padding: 20, borderRadius: 8, backgroundColor: 'white', width: 300 }}>
              <Flex vertical gap={16} style={{ width: '100%' }}>
                <Flex vertical gap={16} align='center'>
                  <Avatar size={80} src={restaurant?.image} shape='circle' />
                  <Flex vertical gap={4} align='center'>
                    <Title level={3} style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
                      {restaurant?.name}
                    </Title>
        
                    <Text style={{ color: '#687588' }}>{restaurant?.description}</Text>
                  </Flex>
                </Flex>
    
                <Divider style={{ margin: 0 }} />
    
                <Flex vertical gap={12}>
                  <Flex gap={4}>
                    <Text style={{ fontWeight: 500 }}>Địa chỉ:</Text>
                    <Text ellipsis={{ tooltip: true }} style={{ flex: 1 }}>{restaurant?.address}</Text>
                  </Flex>
                  <Flex gap={4}>
                    <Text style={{ fontWeight: 500 }}>Ngày tạo:</Text>
                    <Text>{dayjs(restaurant?.createdAt).format('DD/MM/YYYY')}</Text>
                  </Flex>
                  <Flex gap={4}>
                    <Text style={{ fontWeight: 500 }}>Ngày cập nhật:</Text>
                    <Text>{dayjs(restaurant?.updatedAt).format('DD/MM/YYYY')}</Text>
                  </Flex>
                  <Flex gap={4}>
                    <Text style={{ fontWeight: 500 }}>Danh mục:</Text>
                    <Flex>
                      {restaurant?.categories.map(item => {
                        return (
                          <Tag key={item._id}>
                            {item.title}
                          </Tag>
                        )
                      })}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Spin>
  
          <Flex style={{ padding: 20, borderRadius: 8, backgroundColor: 'white', flex: 1 }}>
            <Tabs items={items} activeKey={activeKey} onChange={key => setActiveKey(key)} style={{ width: '100%' }} />
          </Flex>
        </Flex>
      </Flex>

      <ModalDish form={form} open={openModalAddDish} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditDish ? 'edit' : 'create'} />
    </>
  )
}

RestaurantDetail.Layout = MainLayout

export default RestaurantDetail