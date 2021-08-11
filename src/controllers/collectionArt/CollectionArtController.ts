import BaseController from '../BaseController';
import { isError } from 'src/helpers/utils';
import { nanoid } from 'nanoid';
import { IApiResponse, IError } from 'src/core/types';
import Result from 'src/core/Result';

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
      console.log({
        ...request,
        signature: signatureOrError,
      });
      const response = await this.post(`images/${artId}/likes`, {
        ...request,
        signature: signatureOrError,
      });
      return Result.ok((response.data as IApiResponse<boolean>).data);
    } catch (error) {
      return Result.fail<string>((error as IError).message);
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
      console.log({
        ...request,
        signature: signatureOrError,
      });
      const body = JSON.stringify({
        ...request,
        signature: signatureOrError,
      });
      const response = await this.delete(`images/${artId}/likes?payload=${body}`);
      return Result.ok((response.data as IApiResponse<boolean>).data);
    } catch (error) {
      return Result.fail<string>((error as IError).message);
    }
  }
}
