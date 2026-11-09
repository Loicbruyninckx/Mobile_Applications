export interface Cafe {
  id: string;
  name: string;
  city: string;
  createdBy?: string;
  createdAt: string;
}

export interface NewCafe {
  name: string;
  city: string;
}
