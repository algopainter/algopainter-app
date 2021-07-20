export interface IUser {
  id: string;
  name: string;
  email: string;
  age: string;
  interests: string;
  collections: number;
  wallet: {
    algop: number;
  };
  profilePhotoUrl?: string;
}
