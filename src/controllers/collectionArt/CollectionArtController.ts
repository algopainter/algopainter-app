import BaseController from '../BaseController';
import { nanoid } from 'nanoid';
import { SignedRequest } from '../types';

export default class CollectionArtController extends BaseController {
  async favoriteArt(artId: string, address: string) {
    try {
      const data = {
        imageId: artId,
        salt: nanoid(),
      };
      const signature = await this.web3Helper.hashMessageAndAskForSignature(
        JSON.stringify(data),
        address
      );

      const request = this.requestToBeSigned(data, address);

      return { ...request, signature } as SignedRequest;
    } catch (error) {
      return null;
    }
  }
}
