import CategoryRepository from "@/services/Repositories/CategoryRepository";
import CommonRepository from "@/services/Repositories/CommonRepository";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal, ModalProps, Upload, UploadProps } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { use, useEffect, useState } from "react";

export interface ModalRestaurantProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalRestaurant ({form, type, ...props}: ModalRestaurantProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'removed') {
      setImageUrl('')
    }
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if (info.file.originFileObj) {
        const uploadFile = new FormData()
        const file: any = info.file.originFileObj
        uploadFile.append('file', file)
        const responseImage = await CommonRepository.uploadImage(uploadFile)
        console.log(responseImage)
        if (responseImage?.data) {
          (info.file as any).src = responseImage.data.src
          setImageUrl(responseImage.data.src)
        }
      }
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal {...props} title={type === 'create' ? 'Thêm nhà hàng' : 'Chỉnh sửa nhà hàng'} width={600}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }}>
        <Form.Item label="Tên nhà hàng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên nhà hàng!' }]}>
          <Input placeholder="Example: Nhà hàng Phương Nam" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input placeholder="Example: Nhà hàng có truyền thống..." />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhà hàng!' }]}>
          <Input placeholder="Địa chỉ nhà hàng" />
        </Form.Item>

        <Form.Item label="Kinh độ" name="lng" rules={[{ required: true, message: 'Vui lòng nhập kinh độ của nhà hàng!' }]}>
          <Input placeholder="Kinh độ nhà hàng" />
        </Form.Item>

        <Form.Item label="Vĩ độ" name="lat" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ của nhà hàng!' }]}>
          <Input placeholder="Vĩ độ nhà hàng" />
        </Form.Item>

        <Form.Item name="file" label="Ảnh danh mục" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Vui lòng thêm ảnh cho nhà hàng!' }]}>
          <Upload
            name="file" 
            listType="picture-card" 
            maxCount={1}
            onChange={handleChange}
            accept='image/jpeg, image/png, image/jpg'
            action={undefined}
            method='post'
            headers={{
              'Content-Type': 'multipart/form-data',
            }}
            onPreview={() => window.open(imageUrl, '_blank')}
          >
            {uploadButton}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
