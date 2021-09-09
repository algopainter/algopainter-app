import { api } from 'boot/axios';

import { IImage } from 'src/models/IImage';

export async function getImage(id: string): Promise<IImage> {
  const response = await api.get<IImage>(`images/${id}`);

  return response.data;
}
