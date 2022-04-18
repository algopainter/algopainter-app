/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import ICollection from 'src/models/ICollection';
import { IImage } from 'src/models/IImage';
import BaseController from '../BaseController';
import Collections from 'src/data/Collections.json';
import { nanoid } from 'nanoid';
import { isError } from 'src/helpers/utils';

export default class CollectionController extends BaseController {
  async getCollections() {
    try {
      const result = await this.get('collections');
      return result.data as ICollection[];
    } catch (error) {
      return null;
    }
  }

  async getCollectionsImages(id: string, page: number = 1, perPage: number = 24) {
    try {
      const result = await this.get(`collections/${id}/images?page=${page}&perPage=${perPage}&order.nft.index=-1`);
      return result.data.data as IImage[];
    } catch (error) {
      return [];
    }
  }

  async getAllImages(page: number = 1, perPage: number = 24) {
    try {
      const result = await this.get(`images?page=${page}&perPage=${perPage}&order.nft.index=-1`);
      return result.data.data as IImage[];
    } catch (error) {
      return [];
    }
  }

  getCollectionById(id: number) {
    return Collections.find(c => c.id === id);
  }

  async createCollectionByExternalContract(request: CreateCollectionByExternalContractRequest) : Promise<boolean> {
    const signRequestData = {
      ...request,
      salt: nanoid()
    };

    const signatureOrError = await this.web3Helper.hashMessageAndAskForSignature(signRequestData, request.account);

    if (isError(signatureOrError as Error)) {
      throw signatureOrError;
    }

    const signRequest = {
      data: signRequestData,
      salt: signRequestData.salt,
      signature: signatureOrError,
      account: request.account
    };

    const result = await this.post(`collections`, signRequest);

    return result.status == 200;
  }
}

export interface CreateCollectionByExternalContractRequest {
  address: string;
  name: string;
  account: string;
  nfts: ExternalNFTInfo[]
}

export interface ExternalNFTInfo {
  id: number;
  name?: string;
  description?: string;
  image?: string;
  descriptor?: string;
  params?: string;
}
