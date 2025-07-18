export type User = {
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
};

export type Address = {
  Line1: string;
  Line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};
