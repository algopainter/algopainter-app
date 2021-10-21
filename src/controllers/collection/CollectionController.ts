/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ICollection } from 'src/models/ICollection';
import { IImage } from 'src/models/IImage';
import BaseController from '../BaseController';

export default class CollectionController extends BaseController {
  async getCollections() {
    try {
      const result = await this.get('collections');
      return result.data as ICollection[];
    } catch (error) {
      return null;
    }
  }

  async getCollectionsImages(id: string, page: number = 1, perPage: number = 24, collection: string = '') {
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
}
