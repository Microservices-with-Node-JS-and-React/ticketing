import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server!
    // Cross-Domain requests should be made to
    // http://SERVICE-NAME.NAMESPACE.svc.cluster.local

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',

      // attach cookies and the hostname which is mapped in the ingress-srv.yaml
      headers: req.headers,
    });
  } else {
    // we are on the browser,
    // requests can be made with a base url of ''
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
