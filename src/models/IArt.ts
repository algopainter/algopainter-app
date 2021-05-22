interface Person {
  id: string;
  name: string;
  picture: string;
}

export interface IArt {
  id: string;
  name: string;
  source: string;
  price: number;
  bidBack: number;
  pirs: {
    creators: number;
    investors: number;
  }
  importantPeople: Person[];
}
