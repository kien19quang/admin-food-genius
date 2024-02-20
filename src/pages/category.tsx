import ModalCategory from "@/components/Modals/ModalAddCategory"
import MainLayout from "@/layouts/MainLayout/MainLayout"
import { CategoryDto, ICategory } from "@/models/Category/CategoryModel"
import CategoryRepository from "@/services/Repositories/CategoryRepository"
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Flex, Form, Image, Modal, Table, Typography, message } from "antd"
import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

const { Title, Text } = Typography
const { confirm } = Modal
 
const Category = () => {
  const [listCategory, setListCategory] = useState<ICategory[]>([])
  const [openModalAddCategory, setOpenModalAddCategory] = useState<boolean>(false)
  const [idEditCategory, setIdEditCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);

  const [form] = Form.useForm()

  useEffect(() => {
    fetchListCategory()
  }, [])

  const fetchListCategory = async () => {
    setLoading(true)
    const categories = await CategoryRepository.getListCategory()
    setLoading(false)
    if (categories) {
      setListCategory(categories)
    }
  }

  const handleEditCategory = async (record: ICategory) => {
    setIdEditCategory(record._id);
    setOpenModalAddCategory(true);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      image: record.image,
      file: [{
        uid: record._id,
        status: 'done',
        url: record.image,
        src: record.image,
      }]
    });
  };

  const handleDeleteCategory = async (record: ICategory) => {
    confirm({
      title: 'Bạn có chắc muốn xoá danh mục này không?',
      onOk: async () => {
        const response = await CategoryRepository.deleteCategory(record._id);
        if (response?.deletedCount) {
          setListCategory((prev) => prev.filter((item) => item._id !== record._id));
          message.success('Xoá danh mục thành công');
        }
      },
    });
  };

  const handleCancelModal = () => {
    setOpenModalAddCategory(false);
    setIdEditCategory('');
    form.resetFields();
  };

  const handleSubmit = () => {
    setLoadingConfirm(true);
    form
      .validateFields()
      .then(async (values: CategoryDto) => {
        values.image = (values as any).file?.[0]?.src;
        delete (values as any).file
        const newListCategory = [...listCategory];
        if (!idEditCategory) {
          const category = await CategoryRepository.createCategory(values);
          if (category) {
            newListCategory.push(category)
          }
        } else {
          const category = await CategoryRepository.updateCategory(idEditCategory, values);
          if (category) {
            const index = newListCategory.findIndex((item) => item._id === category._id);
            newListCategory[index] = category;
          }
        }
        message.success(idEditCategory ? 'Cập nhật danh mục thành công' : 'Thêm danh mục thành công');
        console.log(newListCategory)
        setListCategory(newListCategory);
        setOpenModalAddCategory(false);
        setIdEditCategory('');
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

  const columns: ColumnsType<ICategory> = [
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
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: value => <Image src={value} alt="Ảnh danh mục" width={40} height={40} style={{ objectFit: 'cover' }} />
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
            <Button icon={<EditOutlined />} onClick={() => handleEditCategory(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteCategory(record)} />
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
              Danh sách danh mục
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddCategory(true)}>
              Thêm danh mục
            </Button>
          </Flex>
          <Table loading={loading} pagination={{ showSizeChanger: true }} columns={columns} dataSource={listCategory} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalCategory form={form} open={openModalAddCategory} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loadingConfirm} type={idEditCategory ? 'edit' : 'create'} />
    </>
  )
}

Category.Layout = MainLayout

export default Category