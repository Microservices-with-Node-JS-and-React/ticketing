import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1>;
};

// called by nextjs on Component pre-creation,
// and injects the props, the call may be serverside on hard refresh, link redirects
// or client side when redirecting while in the app
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
