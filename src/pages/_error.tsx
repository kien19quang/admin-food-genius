import { Button, Result } from 'antd';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';

interface ErrorProps {
  statusCode: number;
}

function Error({ statusCode }: ErrorProps) {
  const router = useRouter()

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <Result
      status={statusCode as any}
      title={statusCode}
      subTitle={statusCode === 404 ? 'Sorry, the page you visited does not exist.' : 'Sorry, something went wrong.'}
      extra={<Button type="primary" onClick={handleBackHome} style={{boxShadow: "none"}}>Back Home</Button>}
      style={{
        width: '100%',
        height: '100vh',
        background: '#fff',
      }}
    />
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
