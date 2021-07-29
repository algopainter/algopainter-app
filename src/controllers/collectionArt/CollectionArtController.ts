import BaseController from '../BaseController';
import { nanoid } from 'nanoid';

export default class CollectionArtController extends BaseController {
  async favoriteArt(artId: string, address: string) {
    try {
      const data = {
        imageId: artId,
        salt: nanoid(),
      };
      const signature = await this.web3Helper.hashMessageAndAskForSignature(
        data,
        address
      );

      const request = this.requestToBeSigned(data, address);

      const signedRequest = { ...request, signature };

      const result = await this.post(`images/${artId}/like`, signedRequest);

      return result.data as unknown;
    } catch (error) {
      return null;
    }
  }

  async deleteFavoriteArt(artId: string, address: string) {
    try {
      const data = {
        imageId: artId,
        salt: nanoid(),
      };
      const signature = await this.web3Helper.hashMessageAndAskForSignature(
        data,
        address
      );

      const request = this.requestToBeSigned(data, address);

      const signedRequest = { ...request, signature };

      const result = await this.delete(`images/${artId}/unlike`, signedRequest);

      return result.data as unknown;
    } catch (error) {
      return null;
    }
  }
}
