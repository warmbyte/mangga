import React, { useEffect, useRef } from "react";
import { Box, Stack, Heading, Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { usePeer } from "@hooks";
import { useAudioStream } from "@hooks";

export const RoomDetail: React.FC = () => {
  const { createPeer, data } = usePeer();
  const myStream = useAudioStream();
  const { parties } = data;
  const router = useRouter();
  const audioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (router?.query?.slug && !data?.isHost && !window["peer"] && myStream) {
      createPeer(false, router?.query?.slug, myStream);
    }
  }, [router?.query?.slug, myStream]);

  useEffect(() => {
    if (audioContainerRef.current) {
      parties.forEach((stream) => {
        const audioNode = document.createElement("audio");
        audioNode.autoplay = true;
        audioNode.srcObject = stream;
        audioContainerRef.current.appendChild(audioNode);
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
            <Heading size="sm">Speakers ({parties.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="flex-start" align="center">
            {parties.map((_, index) => (
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
