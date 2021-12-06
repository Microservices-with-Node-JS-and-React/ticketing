import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { useEffect } from 'react';

const signoutPage = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out ...</div>;
};

export default signoutPage;
