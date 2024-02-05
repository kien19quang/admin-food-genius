import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal, ModalProps, Rate, Select, message } from "antd";

export interface ModalAddUserProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalAddUser ({form, type, ...props}: ModalAddUserProps) {
  return (
    <Modal {...props} title={type === 'create' ? 'Thêm tài khoản' : 'Chỉnh sửa tài khoản'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }}>
        <Form.Item label="Tên người dùng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}>
          <Input placeholder="Example: Nguyễn Văn A" prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!', type: 'email' }]}>
          <Input placeholder="Example: example@gmail.com" prefix={<MailOutlined />} />
        </Form.Item>

        {type === 'create' && (
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
