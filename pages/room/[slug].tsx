import React, { useEffect, useRef } from "react";
import { Box, Stack, Heading, Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { usePeer } from "@hooks";
import { useAudioStream } from "@hooks";

export const RoomDetail: React.FC = () => {
  const { createPeer, data } = usePeer();
  const { parties, roomName, isHost } = data;
  const myStream = useAudioStream();
  const router = useRouter();
  const audioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thereIsMyId = window["identity"]?.find(
      (item) => item.streamId === myStream?.id
    );
    if (!isHost && !thereIsMyId && myStream) {
      const name = prompt("Please enter your name", "Harry Potter");
      window["identity"] = [
        { name, streamId: myStream?.id },
        ...(window["identity"] ?? []),
      ];
      if (router?.query?.slug && !window["peer"] && myStream) {
        createPeer(false, router?.query?.slug, myStream);
      }
    }
  }, [router?.query?.slug, myStream]);

  useEffect(() => {
    if (audioContainerRef.current) {
      parties.forEach((stream) => {
        if (!document.getElementById(stream.id) && stream.id !== myStream.id) {
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
          <Heading size="lg">{roomName}</Heading>
        </Stack>
        <Stack>
          <Box>
            <Heading size="md">Parties ({parties.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="flex-start" align="center">
            {parties.map((party) => (
              <WrapItem
                alignItems="center"
                justifyContent="center"
                minW="calc(25% - 1.5rem)"
                key={party.id}
              >
                <Stack align="center" justify="center">
                  <Avatar
                    size="lg"
                    src={`https://i.pravatar.cc/150?u=${party.id}`}
                  />
                  <Heading size="xs">{party.id?.slice(0, 5)}</Heading>
                </Stack>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
      </Stack>
      <Box ref={audioContainerRef} />
    </Box>
  );
};

export default RoomDetail;
