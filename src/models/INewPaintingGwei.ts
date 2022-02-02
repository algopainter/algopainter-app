export interface IGweiItemParameters {
  text: string,
  useRandom: string,
  inspiration: {
    label: string,
    value: string
  },
  probability: number,
  overlay: {
    label: string,
    value: string
  },
  overlayOpacity: string,
  wallType: {
    label: string,
    value: string
  },
}

export interface IGweiParsedItemParameters {
  parsedText: string,
  parsedUseRandom: string,
  parsedInspiration: string,
  parsedProbability: number,
  parsedOverlay: string | number,
  parsedOverlayOpacity: string | number,
  parsedWallType: string,
}

export interface IGweiPayload {
  image: string,
  text: string,
  inspiration: string,
  useRandom: string,
  probability: number,
  place: string,
  description: string,
  amount: string,
  overlay: number | string,
  overlayOpacity: number | string,
  mintedBy: string,
}
export interface INewMintGwei {
  inspiration: number;
  text: string;
  useRandom: boolean;
  probability: number;
  place: number;
  amount: string;
  tokenURI: string;
}