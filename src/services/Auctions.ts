/* eslint-disable @typescript-eslint/no-unsafe-return */
import createApi from './Api';

function Auctions() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const api = createApi();

  function fetchHotBids() {
    const endpoint = 'auctions?page=1&isHot=true';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return api.get(endpoint);
  }

  return {
    fetchHotBids,
  };
}

export default Auctions();