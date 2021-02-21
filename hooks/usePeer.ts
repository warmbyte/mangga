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
  const [loading, setLoading] = useState(false);
  const [parties, setParties] = useRecoilState(partiesAtom);
  const [peer, setPeer] = useRecoilState(peerAtom);

  useEffect(() => {
    if (!window["Peer"]) {
      window["Peer"] = require("peerjs").default;
    }

    if (!window["peers"]) {
      window["peers"] = {};
    }
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
        if (isHost) {
          Object.values(window["peers"]).map((partyCon: any) => {
            partyCon.send({ type: "newConnection", id: call.peer });
          });
        }
        window["peers"] = {
          ...window["peers"],
          [call.peer]: newPeer.connect(call.peer),
        };
      });

      newPeer.on("connection", function (c) {
        c.on("data", (data: any) => {
          if (!isHost) {
            if (data?.type === "newConnection") {
              const call = newPeer.call(data?.id, myStream);
              call.on("stream", (remoteStream) => {
                setParties([...parties, remoteStream]);
              });
            }
          }
        });
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
