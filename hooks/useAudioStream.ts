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
      const getUserMedia: typeof navigator.getUserMedia =
        navigator.getUserMedia ||
        // @ts-ignore
        navigator.webkitGetUserMedia ||
        // @ts-ignore
        navigator.mozGetUserMedia ||
        // @ts-ignore
        navigator.msGetUserMedia;

      getUserMedia(
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
