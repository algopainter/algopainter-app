import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { IGweiParsedItemParameters } from 'src/models/INewPaintingGwei';
import { ICollection } from 'src/models/ICollection';
export default interface MintStateInterface {
  gwei: {
    collectionInfo: ICollectionInfo | undefined,
    itemParameters: IGweiParsedItemParameters | undefined,
    previewUrl: string | undefined,
    artBasicInfo: IArtBasicInfo | undefined,
    IPFSUrl: string | undefined,
    userConfirmations: boolean | undefined,
    isMinting: boolean,
    errorMessage: string | undefined
  },
  expressions: {
    collectionInfo: ICollectionInfo | undefined,
    itemParameters: IGweiParsedItemParameters | undefined,
    previewUrl: string | undefined,
    artBasicInfo: IArtBasicInfo | undefined,
    IPFSUrl: string | undefined,
    userConfirmations: boolean | undefined,
    isMinting: boolean,
    errorMessage: string | undefined
  },
  formGenerator: {
    isCollectionExistent: boolean,
    collectionData: undefined | ICollection,
    collectionInfo: ICollectionInfo | undefined,
    previewUrl: string | undefined,
    artBasicInfo: IArtBasicInfo | undefined,
    IPFSUrl: string | undefined,
    userConfirmations: boolean | undefined,
    isMinting: boolean,
    errorMessage: string | undefined
  }
}
