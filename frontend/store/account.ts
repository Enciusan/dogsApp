import { create } from "zustand";
import { UserType } from "../types/account";

type State = {
  accountInformation: Partial<UserType>;
  isChanged: boolean;
};

type Action = {
  updateAccountInformation: (accountInformation: State["accountInformation"]) => void;
  updateIsChanged: (isChanged: State["isChanged"]) => void;
};

export const useAccountStore = create<State & Action>((set) => ({
  accountInformation: { username: "", dogName: "", avatarUrl: "" },
  isChanged: false,
  updateAccountInformation: (value: UserType) => set(() => ({ accountInformation: value })),
  updateIsChanged: (value: boolean) => set(() => ({ isChanged: value })),
}));
