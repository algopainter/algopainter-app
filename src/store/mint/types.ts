import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { IGweiParsedItemParameters } from 'src/models/INewPaintingGwei';
import ICollection from 'src/models/ICollection';
import { IFormParams } from 'src/models/ICreatorCollection';
export default interface MintStateInterface {
  updateTopInfo: boolean,
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
    collectionParams: undefined | IFormParams[],
    collectionName: undefined | IFormParams[],
    collections: undefined | IFormParams[]
    collectionsVerify: undefined | IFormParams[]
    isCollectionExistent: boolean,
    collectionData: undefined | ICollection,
    collectionInfo: ICollectionInfo | undefined,
    previewUrl: string | undefined,
    artBasicInfo: IArtBasicInfo | undefined,
    IPFSUrl: string | undefined,
    userConfirmations: boolean | undefined,
    isMinting: boolean,
    errorMessage: string | undefined,
    isPinningPreviewUrl: boolean,
  }
}
