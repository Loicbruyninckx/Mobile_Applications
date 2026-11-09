export interface Beer {
  id: string;
  name: string;
  brewery?: string;
  style?: string;
  abv?: number;
  createdBy?: string;
  createdAt: string;
}

export interface NewBeer {
  name: string;
  brewery?: string;
  style?: string;
  abv?: number;
}
