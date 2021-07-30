import BaseController from '../BaseController';
import { isError } from 'src/helpers/utils';
import { nanoid } from 'nanoid';

export default class CollectionArtController extends BaseController {
  async favoriteArt(artId: string, address: string) {
    try {
      const data = {
        imageId: artId,
        salt: nanoid(),
      };

      const signatureOrError =
        await this.web3Helper.hashMessageAndAskForSignature(data, address);

      if (isError(signatureOrError as Error)) {
        throw signatureOrError;
      }

      const request = this.requestToBeSigned(data, address);
      const response = await this.post(`images/${artId}/like`, {
        ...request,
        signatureOrError,
      });
      return response.data as boolean;
    } catch (error) {
      return error as Error;
    }
  }

  async deleteFavoriteArt(artId: string, address: string) {
    try {
      const data = {
        imageId: artId,
        salt: nanoid(),
      };

      const signatureOrError =
        await this.web3Helper.hashMessageAndAskForSignature(data, address);

      if (isError(signatureOrError as Error)) {
        throw signatureOrError;
      }

      const request = this.requestToBeSigned(data, address);
      const response = await this.delete(`images/${artId}/dislike`, {
        ...request,
        signatureOrError,
      });
      return response.data as boolean;
    } catch (error) {
      return error as Error;
    }
  }
}
