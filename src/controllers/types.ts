export interface SignedRequestData {
  [key: string]: unknown;
  salt: string;
}

export interface RequestToBeSigned {
  data: SignedRequestData;
  salt: string;
  account: string;
}

export interface SignedRequest extends RequestToBeSigned {
  signature: string;
}
