export interface IProfile {
  _id?: string;
  account?: string;
  updatedAt?: string;
  customProfile?: string | undefined;
  createdAt?: string;
  avatar?: string;
  name?: string;
  nick?: string;
  email?: string | null;
  bio?: string;
  type?: string;
  instagram?: string | null;
  twitter?: string | null;
  _v?: number;
  facebook?: string | null;
  gmail?: string | null;
  telegram?: string | null;
  webSite? : string | null;
}
