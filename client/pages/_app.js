import 'bootstrap/dist/css/bootstrap.css';

// this custom _app component wraps all of the pages
// global css that needs to be imported in every page, should be imported here
const component = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default component;
