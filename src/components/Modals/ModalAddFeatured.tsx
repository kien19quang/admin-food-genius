import { IRestaurant } from "@/models/Restaurant/RestaurantModel";
import RestaurantRepository from "@/services/Repositories/RestaurantRepository";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal, ModalProps, Rate, Select, Switch, message } from "antd";
import { useEffect, useState } from "react";

export interface ModalAddFeaturedProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddFeatured ({form, type, ...props}: ModalAddFeaturedProps) {
  const [listRestaurant, setListRestaurant] = useState<IRestaurant[]>([])

  useEffect(() => {
    handleGetListRestaurant()
  }, [])

  const handleGetListRestaurant = async () => {
    const response = await RestaurantRepository.getListRestaurant()
    if (response) {
      setListRestaurant(response)
    }
  }

  return (
    <Modal {...props} title={type === 'create' ? 'Thêm mục nổi bật' : 'Chỉnh sửa mục nổi bật'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ isVisible: true }}>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
          <Input placeholder="Example: Hot and Spicy" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input placeholder="Example: Soft and tender fried chicken" />
        </Form.Item>

        <Form.Item label="Nhà hàng" name="restaurantIds" rules={[{ required: true, message: 'Vui lòng chọn nhà hàng!' }]}>
          <Select 
            mode='multiple'
            placeholder='Chọn nhà hàng'
            options={listRestaurant.map(item => {
              return {
                label: item.name,
                value: item._id
              }
            })}
          />
        </Form.Item>

        <Form.Item label="Hiển thị" name="isVisible">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
