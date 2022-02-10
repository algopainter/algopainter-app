import { ICollectionInfo, IArtBasicInfo } from 'src/models/IMint';
import { IGweiParsedItemParameters } from 'src/models/INewPaintingGwei';
import { IFormParams } from 'src/models/ICreatorCollection';
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
    errorMessage: string | undefined
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
    errorMessage: string | undefined
  },
  formGenerator: {
    isCollectionExistent: boolean,
    collectionParams: undefined | IFormParams[]
    collectionName: undefined | IFormParams[]
  }
}
