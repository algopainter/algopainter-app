import { api } from 'boot/axios';

import { IAuctionItem } from 'src/models/IAuctionItem';
import { IBid } from 'src/models/IBid';

export async function getAuctionDetails(id: string): Promise<IAuctionItem> {
  const response = await api.get<IAuctionItem>(`auctions/${id}`);

  return response.data;
}

export async function getBids(id: string): Promise<IBid[]> {
  const response = await api.get<IBid[]>(`auctions/${id}/bids`);

  return response.data;
}
