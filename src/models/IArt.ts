interface Person {
  id: string;
  name: string;
  picture: string;
  accountable: string;
}

export interface IArt {
  id: string;
  name: string;
  source: string;
  algopainter: string;
  owner: string;
  price: number;
  keywords: string;
  bidBack: number;
  pirs: {
    creators: number;
    investors: number;
  }
  importantPeople: Person[];
}
