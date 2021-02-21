import { useState, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { getConnections, broadcast } from "../lib";

const partiesAtom = atom<MediaStream[]>({
  key: "partiesAtom",
  default: [],
});

export const identityAtom = atom<{ name?: string; streamId?: string }[]>({
  key: "identityAtom",
  default: [],
});

export const peerAtom = atom({
  key: "peerAtom",
  default: {
    id: null,
    roomName: "",
    isHost: false,
  },
});

export const UsersAtom = atom({
  key: "usersAtom",
  default: [new Date().getTime()],
});

export const usePeer = () => {
  const [loading] = useState(false);
  const [parties, setParties] = useRecoilState(partiesAtom);
  const [peer, setPeer] = useRecoilState(peerAtom);

  useEffect(() => {
    if (!window["Peer"]) {
      window["Peer"] = require("peerjs").default;
    }

    window.addEventListener("beforeunload", () => {
      if (window["peer"]) {
        window["peer"]?.destroy();
      }
    });

    setInterval(() => {
      setParties(window["parties"] ?? []);
    }, 2000);
  }, []);

  const createPeer = (
    isHost = false,
    targetConnection = null,
    myStream: MediaStream,
    roomName?: string
  ) => {
    if (!window["peer"]) {
      const myPeer = new Peer(null, {
        host: "peer.warmbyte.com",
        port: 443,
        path: "/myapp",
        secure: true,
      });
      window["parties"] = [myStream];

      myPeer.on("open", () => {
        if (myPeer.id === null && window["peer"] !== null) {
          myPeer.id = peer?.id;
        } else {
          setPeer({ id: myPeer.id, roomName: roomName ?? "", isHost });
          window["peer"] = myPeer;
        }

        if (!isHost && targetConnection) {
          const hostConnection = myPeer.connect(targetConnection);
          let hostCall = myPeer.call(targetConnection, myStream);

          hostCall.on("stream", (remoteStream) => {
            window["parties"] = [...(window["parties"] ?? []), remoteStream];
          });

          hostConnection.on("data", (data) => {
            console.log(data);
            if (data?.type === "roomName") {
              setPeer({ ...peer, roomName: data.roomName });
            }

            if (data?.type === "party") {
              data?.connections?.forEach((connectionId: string) => {
                if (connectionId !== myPeer.id) {
                  const otherClientCall = myPeer.call(connectionId, myStream);

                  otherClientCall.on("stream", (remoteStreamOther) => {
                    window["parties"] = [
                      ...(window["parties"] ?? []),
                      remoteStreamOther,
                    ];
                  });
                }
              });
            }
          });
        }
      });

      myPeer.on("connection", () => {
        const connections = getConnections();
        broadcast({ type: "party", connections });
        broadcast({ type: "roomName", roomName: peer.roomName });
      });

      myPeer.on("call", (call) => {
        call.answer(myStream);
        call.on("stream", (remoteStream) => {
          window["parties"] = [...(window["parties"] ?? []), remoteStream];
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
