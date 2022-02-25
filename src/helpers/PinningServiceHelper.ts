import axios from 'axios';
import { IExpressionsPayload } from 'src/models/INewPaintingExpressions';
import { IGenericPayload } from 'src/models/IMint';

export default class PinningServiceHelper {
  static async pinFile(name: string, collection: number, path: string) {
    const baseUrl: string | undefined = process.env.VUE_APP_MS_IPFS_PINNER

    console.log('baseUrl', baseUrl);
    const endpoint = (baseUrl) ? `${baseUrl}?name=${encodeURI(name)}&collection=${encodeURI(collection.toString())}&path=${escape(encodeURI(path))}` : '';
    console.log('endpoint', endpoint);

    const response = await axios.get(endpoint);
    console.log('response', response);

    return response.data as {error?: string, ipfsHash?: string};
  }

  static async pinJSON(data: IExpressionsPayload | IGenericPayload) {
    const response = (process.env.VUE_APP_MS_IPFS_PINNER) ? await axios.post(process.env.VUE_APP_MS_IPFS_PINNER, data) : { data: '' };

    return response.data as {error?: string, ipfsHash?: string};
  }
}
