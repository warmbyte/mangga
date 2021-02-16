import { atom, useRecoilState } from "recoil";

const partyStreamAtom = atom<MediaStream[]>({
  key: "partyStreamAtom",
  default: null,
});

export const usePartyStreams = () => {
  return useRecoilState(partyStreamAtom);
};
