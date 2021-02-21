import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Heading,
  Avatar,
  Wrap,
  WrapItem,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { usePeer } from "@hooks";
import { useAudioStream } from "@hooks";

export const RoomDetail: React.FC = () => {
  const { createPeer, data } = usePeer();
  const { parties, users } = data;
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState("");
  const myStream = useAudioStream();
  const router = useRouter();
  const audioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (router?.query?.slug && !data?.isHost && !window["peer"] && myStream) {
      createPeer(false, router?.query?.slug, myStream);
    }
  }, [router?.query?.slug, myStream]);

  const sendChat = (e) => {
    e.preventDefault();
    Array.from(window["peer"]._connections.entries()).forEach((a) => {
      a[1]?.[0]?.send(chat);
    });
    handleChat(chat);
  };

  const handleChat = (data) => {
    if (typeof data === "string") {
      setChats([...chats, data]);
    }
  };

  useEffect(() => {
    if (window["peer"]) {
      window["peer"].on("connection", (conn) => {
        conn.on("data", handleChat);
      });
    }
  }, []);

  useEffect(() => {
    if (audioContainerRef.current) {
      parties.forEach((stream) => {
        if (!document.getElementById(stream.id)) {
          const audioNode = document.createElement("audio");
          audioNode.id = stream.id;
          audioNode.autoplay = true;
          audioNode.srcObject = stream;
          audioContainerRef.current.appendChild(audioNode);
        }
      });
    }
  }, [parties]);

  return (
    <Box>
      <Stack spacing="2rem">
        <Stack>
          <Heading size="lg">Room Name</Heading>
        </Stack>
        <Stack>
          <Box>
            <Heading size="sm">Speakers ({users.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="flex-start" align="center">
            {users.map((_, index) => (
              <WrapItem
                alignItems="center"
                justifyContent="center"
                minW="calc(25% - 1.5rem)"
                key={index}
              >
                <Stack>
                  <Avatar size="lg" />
                  <Heading size="xs">Speaker {index + 1}</Heading>
                </Stack>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
        <form onSubmit={sendChat}>
          <Input value={chat} onChange={(e) => setChat(e.target.value)} />
        </form>
        {chats.map((data, id) => (
          <p key={id}>{data}</p>
        ))}

        {/* <Stack>
          <Box>
            <Heading size="sm">Listeners ({dummyListeners.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="flex-start" align="center">
            {dummyListeners.map((_, index) => (
              <WrapItem
                alignItems="center"
                justifyContent="center"
                minW="calc(25% - 1.5rem)"
                key={index}
              >
                <Stack>
                  <Avatar size="lg" />
                  <Heading size="xs">Listener {index + 1}</Heading>
                </Stack>
              </WrapItem>
            ))}
          </Wrap>
        </Stack> */}
      </Stack>
      <Box ref={audioContainerRef} />
    </Box>
  );
};

export default RoomDetail;
