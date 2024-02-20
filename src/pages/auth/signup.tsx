import { Button, Checkbox, Divider, Form, Input, Row, Typography, message } from 'antd';
import Image from 'next/image';
import SignUpBanner from '@/assets/images/SignUpBanner.png';
import { GoogleIcon, Ornament } from '@/components/Icons';
import { FacebookOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import ApiClient from '@/configs/axiosConfig';
import { signIn, useSession } from 'next-auth/react';
import { IRegisterDto } from '@/models/Auth/AuthTypes';

const { Text, Title } = Typography;

const SignIn = () => {
  const router = useRouter()
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false)

  const register = useCallback(async () => {
    try {
      setLoading(true)
      form
        .validateFields()
        .then(async (values: IRegisterDto) => {
          const resRegister = await ApiClient.POST('/auth/register', values)
          if (resRegister?.error) {
            return message.error(resRegister.error)
          }

          const response = await signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: '/'
          });
          if (response?.error) {
            return message.error(response.error)
          }
          router.push('/')
        })
        .catch((error) => {
          console.log(error)
          if (error?.response?.data?.error) {
            message.error(error?.response?.data?.error)
          }
          else {
            message.error('Vui lòng điền đầy đủ thông tin');
          }
        })
        .finally(() => {
          setLoading(false)
        });
    } catch (error: any) {
      console.log(error);
    }
  }, [form, router]);

  return (
    <Row style={{ flexWrap: 'nowrap', height: '100vh' }}>
      <Row style={{ flex: 1, padding: 24, flexDirection: 'column' }}>
        <Row style={{ flexDirection: 'column', flexGrow: 1, position: 'relative' }} justify="center" align="middle">
          <Row onClick={() => router.back()} style={{ position: 'absolute', top: '5%', left: 60, cursor: 'pointer' }}>
            <Ornament />
          </Row>

          <Row style={{ flexDirection: 'column', gap: 32 }} align="middle">
            <Title level={3} style={{ margin: 0, fontSize: 20 }}>
              Register your account
            </Title>

            <Form form={form} layout="vertical" style={{ width: 400 }}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Vui lòng điền đầy đủ tên của bạn' }]}>
                <Input placeholder="Your full name" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Vui lòng điền email' }]}>
                <Input placeholder="example@gmail.com" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng điền mật khẩu' }]}>
                <Input.Password placeholder="Password" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item shouldUpdate>
                {() => (
                  <Button type="primary" loading={loading} onClick={register} htmlType="submit" disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length} block>
                    Create Account
                  </Button>
                )}
              </Form.Item>

              <Row style={{ flexDirection: 'column', gap: 24 }}>
                {/* <Divider style={{ margin: 0, color: '#687588', fontWeight: 400, fontSize: 14 }}>Or register with</Divider>

                <Row style={{ gap: 16 }}>
                  <Row style={{ flex: 1 }}>
                    <Button block icon={<FacebookOutlined style={{ fontSize: 22, color: '#0084ff' }} />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      Facebook
                    </Button>
                  </Row>

                  <Row style={{ flex: 1 }}>
                    <Button block icon={<GoogleIcon width={22} height={22} />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      Google
                    </Button>
                  </Row>
                </Row> */}

                <Row align='middle' justify='center' style={{ gap: 4 }}>
                  <Text>Already have an account?</Text>
                  <Link href='/auth/signin' style={{ color: '#27A376' }}>Login Here</Link>
                </Row>
              </Row>
            </Form>
          </Row>
        </Row>

        <Row justify="center" style={{ gap: 10 }}>
          <Text style={{ color: '#A0AEC0' }}>© 2023 Food Genius . Alrights reserved.</Text>

          <Text>Terms & Conditions</Text>

          <Text>Privacy Policy</Text>
        </Row>
      </Row>

      <Row style={{ width: '50%', maxWidth: 720, flexDirection: 'column', flexWrap: 'nowrap' }}>
        <Row style={{ height: '100%' }}>
          <Image src={SignUpBanner} alt="Robot" style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority={true} />
        </Row>
      </Row>
    </Row>
  );
};

export default SignIn;
