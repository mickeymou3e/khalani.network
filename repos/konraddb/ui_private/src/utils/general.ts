import { StaticRoutes } from "@/definitions/config";

export const getUserRoleIconPath = (role: string) => {
  const iconName = `user-${role}`;
  return `${StaticRoutes.ICONS}/${iconName}.svg`;
};
