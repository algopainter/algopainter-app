import { api } from 'boot/axios';

import { IAuctionItem } from 'src/models/IAuctionItem';

export async function getAuctionDetails(id: string): Promise<IAuctionItem> {
  const response = await api.get<IAuctionItem>(`auctions/${id}`);

  return response.data;
}
