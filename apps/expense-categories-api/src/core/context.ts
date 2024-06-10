export type UserContext = { type: 'USER'; user: { id: string; email: string } };

export const createContext = async (authToken: string): Promise<UserContext> => {
  console.log(authToken);
  return {} as UserContext;
};
