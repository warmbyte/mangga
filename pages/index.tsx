import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stack, Button, Heading, Text } from "@chakra-ui/react";
import { usePeer } from "@hooks";
import { useAudioStream } from "@hooks";

export default function Home() {
  const router = useRouter();
  const myStream = useAudioStream();
  const { createPeer, data } = usePeer();
  const { id } = data;

  const createRoom = () => {
    createPeer(true, null, myStream);
  };

  useEffect(() => {
    if (id) {
      router.push(`/room/${id}`);
    }
  }, [id]);

  return (
    <>
      <Stack
        spacing="2rem"
        position="relative"
        align="center"
        justify="center"
        h="100%"
      >
        <Stack>
          <Heading textAlign="center">Rumah Kumpul</Heading>
          <Text>Tempat semua orang berkumpul ria</Text>
        </Stack>
        <Button onClick={createRoom} size="lg" colorScheme="pink">
          Buat Ruangan
        </Button>
      </Stack>
    </>
  );
}
