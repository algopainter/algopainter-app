export interface IExpressionsItemParameters {
  background: {
    value: number,
    label: string,
  },
  gender: {
    value: number,
    label: string,
  },
  expressions: {
    value: number,
    label: string,
  },
  expressionTemplate: {
    value: number,
    label: string,
  },
  useWireframe: boolean,
  wireframeHue: number,
  useWireframeBlend: boolean,
  wireframeBlendStyle: {
    value: number,
    label: string,
  },
  innerColorHue: number,
  overlay: { 
    value: number,
    label: string,
  },
  overlayHue: number,
  useShadow: boolean,
  flip: boolean,
}
export interface IExpressionsParsedItemParameters {
  background: number,
  gender: string,
  expressions: string,
  expressionTemplate: number,
  useWireframe: boolean,
  wireframeHue: number,
  useWireframeBlend: boolean,
  wireframeBlendStyle: string,
  innerColorHue: number,
  overlay: number,
  overlayHue: number,
  useShadow: boolean,
  flip: boolean,
}

export interface IExpressionsMintParameters {
  background: number,
  gender: number,
  expressions: number,
  expressionTemplate: number,
  useWireframe: number,
  wireframeHue: number,
  useWireframeBlend: number,
  wireframeBlendStyle: number,
  innerColorHue: number,
  overlay: number,
  overlayHue: number,
  useShadow: number,
  flip: number,
}

export interface IExpressionsPayload {
  name: string,
  description: string,
  image: string,
  previewImage: string,
  collection: {
    id: number,
    name: string,
  },
  parameters: IExpressionsParsedItemParameters,
  mintedBy: string,
}
