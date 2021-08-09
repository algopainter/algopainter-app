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

  async getCollectionsImages(id: string) {
    try {
      const result = await this.get(`collections/${id}/images`);
      return result.data as IImage[];
    } catch (error) {
      return null;
    }
  }
}
