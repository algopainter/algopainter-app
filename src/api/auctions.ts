import { api } from 'boot/axios';

export async function getAuctionDetails(id: string): Promise<unknown[]> {
  const response = await api.get(`auctions/${id}`);

  return response.data as unknown[];
}
