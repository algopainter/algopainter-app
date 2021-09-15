import { api } from 'boot/axios';
import { IBid } from 'src/models/IBid';

export async function getAuctionDetails(id: string): Promise<unknown[]> {
  const response = await api.get(`auctions/${id}`);

  return response.data as unknown[];
}

export async function getBids(id: string): Promise<IBid[]> {
  const response = await api.get<IBid[]>(`auctions/${id}/bids`);

  return response.data;
}
