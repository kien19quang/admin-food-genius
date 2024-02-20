import ModalAddFeatured from "@/components/Modals/ModalAddFeatured"
import MainLayout from "@/layouts/MainLayout/MainLayout"
import { FeaturedDto, IFeatured, IRestaurant } from "@/models/Restaurant/RestaurantModel"
import RestaurantRepository from "@/services/Repositories/RestaurantRepository"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Modal, Switch, Typography, message, Table, TableColumnsType } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"


const { Title, Text } = Typography
const { confirm } = Modal
 
const Featured = () => {
  const [listFeatured, setListFeatured] = useState<IFeatured[]>([])
  const [openModalAddFeatured, setOpenModalAddFeatured] = useState<boolean>(false)
  const [idEditFeatured, setIdEditFeatured] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [loadingSwitch, setLoadingSwitch] = useState<string>('')

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListFeatured()
  }, [])

  const fetchListFeatured = async () => {
    setLoading(true)
    const featureds = await RestaurantRepository.getFeatured()
    setLoading(false)
    if (featureds) {
      setListFeatured(featureds)
    }
  }

  const handleEditFeatured = async (record: IFeatured) => {
    setIdEditFeatured(record._id);
    setOpenModalAddFeatured(true);
    form.setFieldsValue({
      ...record,
      restaurantIds: record.restaurants.map(item => item._id)
    });
  };

  const handleDeleteFeatured = async (record: IFeatured) => {
    confirm({
      title: 'Bạn có chắc muốn xoá mục nổi bật này không?',
      onOk: async () => {
        const response = await RestaurantRepository.deleteFeatured(record._id);
        if (response?.deletedCount) {
          setListFeatured((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá mục nổi bật thành công');
        }
      },
    });
  };

  const handleCancelModal = () => {
    setOpenModalAddFeatured(false);
    setIdEditFeatured('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: FeaturedDto) => {
        const newListFeatured = [...listFeatured];
        if (!idEditFeatured) {
          const featured = await RestaurantRepository.createFeatured(values);
          if (featured) {
            newListFeatured.push(featured)
          }
        } else {
          const featured = await RestaurantRepository.updateFeatured(idEditFeatured, values);
          if (featured) {
            const index = newListFeatured.findIndex((item) => item._id === featured._id);
            newListFeatured[index] = featured;
          }
        }
        message.success(idEditFeatured ? 'Cập nhật mục nổi bật thành công' : 'Thêm mục nổi bật thành công');
        setListFeatured(newListFeatured);
        setOpenModalAddFeatured(false);
        setIdEditFeatured('');
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

  const handleChangeVisible = async (record: IFeatured) => {
    setLoadingSwitch(record._id)
    const featured = await RestaurantRepository.updateFeatured(record._id, {
      title: record.title,
      description: record.description,
      isVisible: !record.isVisible,
      restaurantIds: record.restaurants.map(item => item._id)
    });
    setLoadingSwitch('')
    if (featured) {
      const newListFeatured = [...listFeatured]
      const index = newListFeatured.findIndex((item) => item._id === featured._id);
      newListFeatured[index] = featured;
      setListFeatured(newListFeatured)
      message.success('Thay đổi trạng thái thành công')
    }
  }

  const columns: TableColumnsType<IFeatured> = [
    {
      title: 'Hiển thị',
      dataIndex: 'isVisible',
      render: (value, record) => {
        return <Switch loading={loadingSwitch === record._id} value={value} onChange={() => handleChangeVisible(record)} />
      },
      align: 'center',
      width: 100
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true
    },
    {
      title: 'Các nhà hàng',
      dataIndex: 'restaurants',
      render: (value: IRestaurant[]) => {
        return value.map(item => item.name).join(', ')
      },
      width: 300,
      ellipsis: true
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: value => dayjs(value).format('DD-MM-YYYY')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditFeatured(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteFeatured(record)} />
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
              Danh sách mục nổi bật
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddFeatured(true)}>
              Thêm mục nổi bật
            </Button>
          </Flex>
          <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listFeatured} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalAddFeatured form={form} open={openModalAddFeatured} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditFeatured ? 'edit' : 'create'} />
    </>
  )
}

Featured.Layout = MainLayout

export default Featured