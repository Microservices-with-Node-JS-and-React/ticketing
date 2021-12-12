const LandingPage = ({ currentUser }) => {
  return <h1>{currentUser ? 'You are signed in' : 'You are NOT signed in'}</h1>;
};

// if same function is defined in parent App, any child's function won't be inboked
// so manually invoke them inside the AppComponent.
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
