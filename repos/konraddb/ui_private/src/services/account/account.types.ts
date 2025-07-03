export interface Customer {
  address: string;
  bfid: string | null;
  city: string;
  client_code?: string;
  code: string;
  company_name: string;
  contact_person_name: string;
  country: string;
  created_at: string;
  currency: string;
  deposit_holder_code?: string;
  depot: string | null;
  domain?: string | null;
  email: string | null;
  has_user?: boolean;
  fee?: string;
  fix_default_customer_code?: string | null;
  fix_is_enabled?: boolean;
  fix_reset_seq_number_on_logon?: boolean;
  fix_sender_comp_id?: string | null;
  ibans:
    | {
        currency: string;
        iban: string;
        is_enabled: boolean;
        accountHolder?: string;
        bankName?: string;
        accountType?: string;
        accountNumber?: string;
        routingCode?: string;
        swift?: string;
      }[]
    | [];
  is_enabled: boolean;
  kontokorrent: string | null;
  phone_number: string;
  rubric: string | null;
  vat: string;
  zip_code: string;
}
export interface UserProfileResponse {
  client: Customer;
  code: string;
  customer_code?: string;
  display_name: string;
  features: string[];
  name: string;
  registration_date: string;
  role: string;
}

export interface ApiTokens {
  created_at: string;
  label: string;
  public_key: string;
}

export interface ApiTokensResponse {
  records: ApiTokens[];
}

export interface CreateApiTokenRequest {
  label: string;
  public_key: string;
  signature: string;
}

export enum CreateApiErrors {
  Duplicate = "duplicate",
}

export interface InviteRequest {
  email: string;
  role: string;
}
