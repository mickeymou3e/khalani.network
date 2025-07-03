import { useTranslation } from "next-i18next";

export const useRolesTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    t,

    account: t(`${namespace}:account`),
    roles: t(`${namespace}:roles`),
    rolesDescription: t(`${namespace}:rolesDescription`),
    sendInvite: t(`${namespace}:sendInvite`),
    members: t(`${namespace}:members`),
    accountHolder: t(`${namespace}:accountHolder`),
    role: t(`${namespace}:role`),
    mail: t(`${namespace}:mail`),
    changeRole: t(`${namespace}:changeRole`),
    inviteSent: t(`${namespace}:inviteSent`),
    inviteRequest: t(`${namespace}:inviteRequest`),
    inviteExpired: t(`${namespace}:inviteExpired`),
    sendReminder: t(`${namespace}:sendReminder`),
    admin: t(`${namespace}:admin`),
    trader: t(`${namespace}:trader`),
  };
};
