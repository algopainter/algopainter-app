import { ICollection } from 'src/models/ICollection';
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
}
