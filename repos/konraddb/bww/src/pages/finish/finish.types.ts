import { Moment } from "moment";

export interface IUseFinishForm {
  city: string | null;
  setCity: React.Dispatch<React.SetStateAction<string | null>>;
  date: Moment | null;
  setDate: React.Dispatch<React.SetStateAction<Moment | null>>;
  flatArea: string | null;
  setFlatArea: React.Dispatch<React.SetStateAction<string | null>>;
  roomsNumber: string | null;
  setRoomsNumber: React.Dispatch<React.SetStateAction<string | null>>;
  bathArea: string | null;
  setBathArea: React.Dispatch<React.SetStateAction<string | null>>;
  finish: IFinishes[];
  setFinish: React.Dispatch<React.SetStateAction<IFinishes[]>>;
  phone: string | null;
  setPhone: React.Dispatch<React.SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  validate: boolean;
  setValidate: React.Dispatch<React.SetStateAction<boolean>>;
  finishes: IFinishes[];
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

export interface IStep1Props {
  city: string | null;
  setCity: React.Dispatch<React.SetStateAction<string | null>>;
  date: Moment | null;
  setDate: React.Dispatch<React.SetStateAction<Moment | null>>;
  validate: boolean;
}

export interface IStep2Props {
  flatArea: string | null;
  setFlatArea: React.Dispatch<React.SetStateAction<string | null>>;
  roomsNumber: string | null;
  setRoomsNumber: React.Dispatch<React.SetStateAction<string | null>>;
  bathArea: string | null;
  setBathArea: React.Dispatch<React.SetStateAction<string | null>>;
  finish: IFinishes[];
  setFinish: React.Dispatch<React.SetStateAction<IFinishes[]>>;
  validate: boolean;
  finishes: IFinishes[];
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

export interface IStep3Props {
  phone: string | null;
  setPhone: React.Dispatch<React.SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  onClick: () => void;
  validate: boolean;
  costs: number | undefined;
  finishes: IFinishes[];
}

export interface IFinishes {
  id: number;
  value: string;
  label: string;
  checked: boolean;
  additional?: boolean;
}
