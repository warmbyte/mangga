import { useState, useEffect } from "react";
import { atom, useRecoilState } from "recoil";

const partiesAtom = atom<MediaStream[]>({
  key: "partiesAtom",
  default: [],
});

const peerAtom = atom({
  key: "peerAtom",
  default: {
    id: null,
    isHost: false,
  },
});

export const usePeer = () => {
  // const myStream = useAudioStream();
  const [loading, setLoading] = useState(false);
  const [parties, setParties] = useRecoilState(partiesAtom);
  const [peer, setPeer] = useRecoilState(peerAtom);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (window["peer"]) {
        window["peer"]?.destroy();
      }
    });
  }, []);

  const createPeer = (isHost = false, targetConnection = null, myStream) => {
    if (!window["peer"]) {
      setLoading(true);
      const newPeer = new Peer();

      newPeer.on("open", () => {
        if (newPeer.id === null && window["peer"] !== null) {
          newPeer.id = peer?.id;
        } else {
          setPeer({ id: newPeer.id, isHost });
          window["peer"] = newPeer;
        }

        if (!isHost && targetConnection) {
          const conn = newPeer.connect(targetConnection);

          const call = newPeer.call(targetConnection, myStream);

          call.on("stream", (remoteStream) => {
            setParties([...parties, remoteStream]);
          });

          conn.on("open", () => {
            conn.send("haha");
          });
        }
      });

      newPeer.on("call", (call) => {
        call.answer(myStream);
        call.on("stream", (remoteStream) => {
          setParties([...parties, remoteStream]);
        });
      });

      newPeer.on("connection", function (c) {
        c.on("data", console.log);
      });
    }
  };

  return {
    createPeer,
    loading,
    data: {
      ...peer,
      parties,
    },
  };
};
