export interface IMyGallery {
collectionName: string;
collectionOwner: string;
createdAt: string;
creator: string;
description: string;
likers: [];
likes: number;
nft: {
  image: string;
  index: number;
  sequentialNumber?: number;
  parameters: {
    text: string;
    inspiration: string;
    useRandom: boolean;
    probability: number;
    place: string;
    description: string;
    amount: number;
  }
  previewImage: string;
  rawImage: string;
  _id: string;
}
onSale: boolean;
owner: string;
tags: [];
title: string;
updatedAt: string;
users: {
  name: string;
  email: string;
  account: string;
  webSite: string;
  twitter: string;
  customProfile: string;
  instagram: string;
  type: string;
  role: string;
  avatar: string;
}
_id: string;
__v: number;
}
