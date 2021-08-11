export interface IMyGallery {

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
tags: {

}
likers: {

}
_id: string;
title: string;
likes: number;
creator: string
owner: string;
description: string;
collectionName: string;
collectionOwner: string;
createdAt: string;
updatedAt: string;
nft: {
  _id: string;
  image: string;
  previewImage: string;
  rawImage: string;
  parameters: {
    text: string;
    inspiration: string;
    useRandom: boolean;
    probability: number;
    place: string;
    description: string;
    amount: number;
  }
}
__v: number;
}
