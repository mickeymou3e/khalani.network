export const customerCodeMock = "26a17540-2bf0-428d-b902-33f035bcbeb7";

export const clientMock = {
  address: "B",
  bfid: "5317253",
  city: "beEe",
  code: "b4137ae0-e941-45b2-a9c3-9f1c16f49428",
  company_name: "Company1",
  contact_person_name: "Company1",
  country: "AqE",
  created_at: "2023-05-10T08:07:39Z",
  currency: "EUR",
  deposit_holder_code: "4b99350c-70f5-4d20-ac45-22d11709f4a9",
  depot: "877",
  domain: "3911",
  email: "ndhur@mail.com",
  fee: "4",
  fix_default_customer_code: null,
  fix_is_enabled: false,
  fix_reset_seq_number_on_logon: false,
  fix_sender_comp_id: null,
  ibans: [
    {
      currency: "EUR",
      iban: "DE11416500013918529410",
      is_enabled: true,
    },
  ],
  is_enabled: true,
  kontokorrent: "281",
  phone_number: "34552644",
  rubric: "475",
  vat: "644",
  zip_code: "848",
};

export const userProfileMock = {
  client: clientMock,
  code: "0680f2b1-df2e-48ce-a988-7c7a2d37d8f6",
  customer_code: customerCodeMock,
  display_name: "steve@mail.com",
  features: [],
  name: "steve",
  registration_date: "2023-06-21T12:33:19Z",
  role: "mastertrader",
};
