export interface IUseContactForm {
  name: string | null;
  setName: React.Dispatch<React.SetStateAction<string | null>>;
  surname: string | null;
  setSurname: React.Dispatch<React.SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  phone: string | null;
  setPhone: React.Dispatch<React.SetStateAction<string | null>>;
  content: string | null;
  setContent: React.Dispatch<React.SetStateAction<string | null>>;
  validate: boolean;
  setValidate: React.Dispatch<React.SetStateAction<boolean>>;
}
