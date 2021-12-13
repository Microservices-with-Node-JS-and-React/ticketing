import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, Object.assign({}, body, props));
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const errorTemplate = (
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}> {err.message} </li>
            ))}
          </ul>
        </div>
      );
      setErrors(errorTemplate);
    }
  };

  return { doRequest, errors };
};

export default useRequest;
