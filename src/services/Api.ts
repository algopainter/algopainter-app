import Axios from 'axios';

const createApi = () => {
  const config = {
    baseURL: 'https://algopainter-api.netlify.app/api/',
    headers: {
      common: {
        'Content-Type': 'application/json',
      },
    },
  };

  const instance = Axios.create(config);

  return instance;
};

export default createApi;
