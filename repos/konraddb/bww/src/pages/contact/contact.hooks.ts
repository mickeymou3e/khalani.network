import { useState } from "react";
import { IUseContactForm } from "./contact.types";

export const useContactForm = (): IUseContactForm => {
  const [name, setName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const [validate, setValidate] = useState<boolean>(false);

  return {
    name,
    setName,
    surname,
    setSurname,
    email,
    setEmail,
    phone,
    setPhone,
    content,
    setContent,
    validate,
    setValidate,
  };
};
