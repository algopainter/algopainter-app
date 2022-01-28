import { api } from 'boot/axios';

import { IImage } from 'src/models/IImage';
import { IUser } from 'src/models/IUser';

export async function getImage(id: string): Promise<IImage> {
  const response = await api.get<IImage>(`images/${id}`);

  return response.data;
}

export async function getImageOwners(id: string): Promise<IUser[]> {
  const response = await api.get<IUser[]>(`images/${id}/owners`);

  return response.data;
}
