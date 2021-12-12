import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

// this custom _app component wraps all of the pages
// global css that needs to be imported in every page, should be imported here
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}></Header>
      <Component currentUser={currentUser} {...pageProps} />;
    </div>
  );
};

// called by nextjs on Component pre-creation,
// and injects the props, the call may be serverside on hard refresh, link redirects
// or client side when redirecting while in the app
AppComponent.getInitialProps = async (appContext) => {
  // context parameter different in a Page and App components
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // manually invoke children's function if defined
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
