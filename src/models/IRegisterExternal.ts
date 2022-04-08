export interface INftInfo {
  id: string;
  name: string;
  image: string;
  creator: number;
}

export interface INftDescriptor {
  id: number;
  name: string | undefined;
  description: string | undefined;
  image: string | undefined;
}

export interface INftOption {
  label: string | number;
  value: string | number;
  active: boolean;
  id: number;
  name: string | undefined;
  description: string | undefined;
  image: string | undefined;
}