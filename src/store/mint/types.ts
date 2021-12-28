import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { IGweiParsedItemParameters } from 'src/models/INewPaintingGwei';

export default interface MintStateInterface {
  gwei: {
    collectionInfo: ICollectionInfo | undefined,
    itemParameters: IGweiParsedItemParameters | undefined,
    previewUrl: string | undefined,
    isPreviewing: boolean,
    hasPreviewed: boolean,
    artBasicInfo: IArtBasicInfo | undefined,
    IPFSUrl: string | undefined,
    userConfirmations: boolean | undefined,
    isMinting: boolean,
  },
  expressions: {
    collectionInfo: ICollectionInfo | undefined,
    itemParameters: IGweiParsedItemParameters | undefined,
    previewUrl: string | undefined,
    isPreviewing: boolean,
    hasPreviewed: boolean,
    artBasicInfo: IArtBasicInfo | undefined,
    IPFSUrl: string | undefined,
    userConfirmations: boolean | undefined,
    isMinting: boolean,
  },
}
