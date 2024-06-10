export type UserContext = { type: 'USER'; user: { id: string; email: string } };

export const createContext = async (
  authToken?: string,
  identityToken?: string,
  systemCallToken?: string,
): Promise<UserContext> => {

  return {} as UserContext;
};
