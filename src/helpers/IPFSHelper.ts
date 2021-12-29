import { api } from 'src/boot/axios';
import { IGweiPayload } from 'src/models/INewPaintingGwei';

// let defaultNode;
export default class IPFSHelper {
  /*
  static async connect() {
    if (!defaultNode) {
      defaultNode = await Ipfs.create();
    }
  }

  static getNode() {
    return defaultNode;
  }
  */

  static async addGwei(data:IGweiPayload) {
    const response = await api.post('images/pinToIPFS/JSON', data);

    return {
      path: response.data.ipfsHash
    };
  }

  static async addExpressions(data:IGweiPayload) {
    const response = await api.post('images/pinToIPFS/FILE', data);

    return {
      path: response.data.ipfsHash
    };
  }
/*
  static async read(path) {
    const node = IPFSHelper.getNode();
    const stream = node.cat(path);
    let data = "";

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    return data;
  }
  */
}
