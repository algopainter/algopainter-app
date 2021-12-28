export interface IExpressionsCollection {
  baseToken: string,
  artist: unknown,
  parameters: unknown[],
}

/*
export interface IExpressionsJsonCollection {
  id: number,
  baseToken: string,
  name: string,
  previewUrl: string,
  rawUrl: string,
  artist: {
      name: string,
      address: string,
      website: string,
      twitter: string,
      github: string,
      instagram: string,
      avatar: string,
  },
  pricing: {
      type: string,
      ranges: [
        {
          start: number,
          finish: number,
          price: number,
        },
      ]
  },
  layers: {
      baseUrl: string,
      rawBaseUrl: string,
      names: {
        background: string,
        expression: string,
        shadow: string,
        innercolor: string,
        wireframe: string,
        overlay: string,
      }
  },
  contract: {
      maxTotalSupply: number,
      type: string,
      address: {
        5777: string,
        56: string,
        97: string,
      },
      abi: [
          {
              inputs: unknown[],
              name: string,
              outputs: [
                  {
                    internalType: number,
                    name: string,
                    type: number
                  }
              ],
              stateMutability: string,
              type: Function,
              constant: boolean
          },
          {
              inputs: [
                  {
                      internalType: number,
                      name: string,
                      type: number
                  },
                  {
                      internalType: number,
                      name: string,
                      type: number
                  }
              ],
              name: string,
              outputs: [
                  {
                      internalType: number,
                      name: string,
                      type: number
                  }
              ],
              stateMutability: pure,
              type: function,
              constant: true
          },
          {
              inputs: [],
              name: totalSupply,
              outputs: [
                  {
                      internalType: number,
                      name: ,
                      type: number
                  }
              ],
              stateMutability: view,
              type: function,
              constant: true
          },
          {
              inputs: [
                  {
                      internalType: uint8[],
                      name: _parameters,
                      type: uint8[]
                  },
                  {
                      internalType: number,
                      name: _expectedAmount,
                      type: number
                  },
                  {
                      internalType: string,
                      name: _tokenURI,
                      type: string
                  }
              ],
              name: mint,
              outputs: [
                  {
                      internalType: number,
                      name: ,
                      type: number
                  }
              ],
              stateMutability: payable,
              type: function,
              payable: true
          }
      ]
  },
  parameters: [
      {
          name: background,
          displayName: Background,
          type: Number,
          widget: select,
          defaultValue: 1,
          items: [
              {
                  text: Bitcoin,
                  value: 1
              },
              {
                  text: Block Saturation,
                  value: 2
              },
              {
                  text: Inner Circuit,
                  value: 3
              },
              {
                  text: High Voltage,
                  value: 4
              },
              {
                  text: Mars,
                  value: 5
              }
          ]
      },
      {
          name: gender,
          displayName: Biological Sex,
          type: string,
          widget: select,
          defaultValue: F,
          items: [
              {
                  value: F,
                  text: Female,
                  intValue: 0
              },
              {
                  value: M,
                  text: Male,
                  intValue: 1
              }
          ]
      },
      {
          name: expression,
          displayName: Expression,
          type: string,
          widget: select,
          defaultValue: angry,
          items: [
              {
                  value: serious,
                  text: Neutral,
                  intValue: 0
              },
              {
                  value: happy,
                  text: Happy,
                  intValue: 1
              },
              {
                  value: angry,
                  text: Angry,
                  intValue: 2
              },
              {
                  value: disgust,
                  text: Disgusted,
                  intValue: 3
              },
              {
                  value: surprise,
                  text: Impressed,
                  intValue: 4
              }
          ]
      },
      {
          name: expressionTemplate,
          displayName: Skin,
          type: Number,
          widget: select,
          defaultValue: 1,
          items: [
              {
                  text: Space Code,
                  value: 1
              },
              {
                  text: Deep Tracking,
                  value: 2
              },
              {
                  text: Nebula Metrics,
                  value: 3
              },
              {
                  text: Plasma,
                  value: 4
              },
              {
                  text: Galaxy Node,
                  value: 5
              }
          ]
      },
      {
          name: useWireframe,
          displayName: Use Wireframe,
          type: bool,
          widget: checkbox,
          defaultValue: true
      },
      {
          name: wireframeHue,
          displayName: Wireframe Hue,
          type: Number,
          widget: slider,
          defaultValue: 0,
          minValue: 0,
          maxValue: 9
      },
      {
          name: useWireframeBlend,
          displayName: Use Wireframe Blend,
          type: bool,
          widget: checkbox,
          defaultValue: true
      },
      {
          name: wireframeBlendStyle,
          displayName: Wireframe Blend Style,
          type: string,
          widget: select,
          defaultValue: BLEND_ADD,
          items: [
              {
                  value: BLEND_ADD,
                  text: Add,
                  intValue: 0
              },
              {
                  value: BLEND_DARKEN,
                  text: Darken,
                  intValue: 1
              },
              {
                  value: BLEND_DIFFERENCE,
                  text: Difference,
                  intValue: 2
              },
              {
                  value: BLEND_EXCLUSION,
                  text: Exclusion,
                  intValue: 3
              },
              {
                  value: BLEND_HARDLIGHT,
                  text: Hardlight,
                  intValue: 4
              },
              {
                  value: BLEND_LIGHTEN,
                  text: Ligthen,
                  intValue: 5
              },
              {
                  value: BLEND_MULTIPLY,
                  text: Multiply,
                  intValue: 6
              }
          ]
      },
      {
          name: innerColorHue,
          displayName: Innercolor Hue,
          type: Number,
          widget: slider,
          defaultValue: 0,
          minValue: 0,
          maxValue: 9
      },
      {
          name: overlay,
          displayName: Magic,
          type: Number,
          widget: select,
          defaultValue: 1,
          items: [
              {
                  text: Fractal Perception,
                  value: 1
              },
              {
                  text: Soul Link,
                  value: 2
              },
              {
                  text: Magnetic Fields,
                  value: 3
              },
              {
                  text: Z-Mesh,
                  value: 4
              }
          ]
      },
      {
          name: overlayHue,
          displayName: Overlay Hue,
          type: Number,
          widget: slider,
          defaultValue: 0,
          minValue: 0,
          maxValue: 9
      },
      {
          name: useShadow,
          displayName: Use Shadow,
          type: bool,
          widget: checkbox,
          defaultValue: false
      },
      {
          name: shadowHue,
          displayName: Shadow Hue,
          type: Number,
          widget: hidden,
          defaultValue: 0
      },
      {
          name: flip,
          displayName: Flip,
          type: bool,
          widget: checkbox,
          defaultValue: false
      }
  ]  
}

export interface IExpressionsItemParameters {
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

export interface IExpressionsParsedItemParameters {
  parsedText: string,
  parsedUseRandom: string,
  parsedInspiration: string,
  parsedProbability: number,
  parsedOverlay: string | number,
  parsedOverlayOpacity: string | number,
  parsedWallType: string,
}

export interface IExpressionsPayload {
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
export interface INewMintExpressions {
  inspiration: number;
  text: string;
  useRandom: boolean;
  probability: number;
  place: number;
  amount: number; 
  tokenURI: string;
}
*/