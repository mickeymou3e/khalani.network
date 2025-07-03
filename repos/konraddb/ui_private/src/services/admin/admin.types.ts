export type User = {
  client_code: string;
  code: string;
  created_at: string;
  customer_code: string;
  email: string;
  is_enabled: boolean;
  name: string;
  role: string;
  updated_at: string;
};

export type UsersResponse = {
  records: User[];
};
