export interface IProfile {
  _id?: string;
  account?: string;
  avatar?: string;
  name?: string;
  nick?: string;
  email?: string | null;
  bio?: string;
  customProfile?: string;
  webSite? : string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  gmail?: string | null;
}
