import CategoryRepository from "@/services/Repositories/CategoryRepository";
import CommonRepository from "@/services/Repositories/CommonRepository";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal, ModalProps, Upload, UploadProps } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { use, useEffect, useState } from "react";

export interface ModalCategoryProps extends ModalProps {
  form: FormInstance<any>,
  type: 'edit' | 'create'
}

export default function ModalCategory ({form, type, ...props}: ModalCategoryProps) {
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
    <Modal {...props} title={type === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }}>
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
          <Input placeholder="Example: Đồ ăn nhanh" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input placeholder="Example: Đồ ăn nhanh rất tiện lơi..." />
        </Form.Item>

        <Form.Item name="file" label="Ảnh danh mục" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Vui lòng thêm ảnh cho danh mục!' }]}>
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
