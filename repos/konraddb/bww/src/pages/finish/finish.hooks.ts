import moment from "moment";
import { Moment } from "moment";
import { useState } from "react";
import { IFinishes, IUseFinishForm } from "./finish.types";

const finishes = [
  {
    id: 1,
    value: "szpachlowanie",
    label: "Szpachlowanie ścian i sufitów",
    checked: false,
  },
  {
    id: 2,
    value: "malowanie",
    label: "Malowanie ścian i sufitów",
    checked: false,
  },
  { id: 3, value: "układanie", label: "Układanie posadzek", checked: false },
  { id: 4, value: "wykonanie", label: "Wykonanie łazienki", checked: false },
  {
    id: 5,
    value: "przeróbkiElektryczne",
    label: "Przeróbki instalacji elektrycznych",
    checked: false,
    additional: true,
  },
  {
    id: 6,
    value: "przeróbkiWodne",
    label: "Przeróbki instalacji wodnych",
    checked: false,
    additional: true,
  },
  {
    id: 7,
    value: "zmiany",
    label: "Zmiany położenia lub dodatkowe wykonanie ścian działowych",
    checked: false,
    additional: true,
  },
];

export const useFinishForm = (): IUseFinishForm => {
  const [validate, setValidate] = useState<boolean>(false);
  const [city, setCity] = useState<string | null>(null);
  const [date, setDate] = useState<Moment | null>(
    moment("2023-08-18T21:11:54")
  );

  const [flatArea, setFlatArea] = useState<string | null>(null);
  const [roomsNumber, setRoomsNumber] = useState<string | null>(null);
  const [bathArea, setBathArea] = useState<string | null>(null);

  const [finish, setFinish] = useState<IFinishes[]>(finishes);

  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [files, setFiles] = useState<File[] | undefined>(undefined);

  return {
    city,
    setCity,
    date,
    setDate,
    flatArea,
    setFlatArea,
    roomsNumber,
    setRoomsNumber,
    bathArea,
    setBathArea,
    finish,
    setFinish,
    phone,
    setPhone,
    email,
    setEmail,
    validate,
    setValidate,
    finishes,
    files,
    setFiles,
  };
};
