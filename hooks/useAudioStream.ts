import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const audioStreamAtom = atom<MediaStream | null>({
  key: "audioStreamAtom",
  default: null,
});

export const useAudioStream = () => {
  const [stream, setStream] = useRecoilState(audioStreamAtom);

  useEffect(() => {
    if (!stream) {
      navigator.getUserMedia(
        { audio: true, video: false },
        (audioStream) => {
          setStream(audioStream);
        },
        (err) => {
          throw err;
        }
      );
    }
  }, [stream]);

  return stream;
};
