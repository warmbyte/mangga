import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input, Stack, Button, Heading, Text } from "@chakra-ui/react";
import { usePeer } from "@hooks";
import { useAudioStream } from "@hooks";

export default function Home() {
  const router = useRouter();
  const myStream = useAudioStream();
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const { createPeer, data } = usePeer();
  const { id } = data;

  const createRoom = () => {
    window["identity"] = [
      { name, streamId: myStream?.id },
      ...(window["identity"] ?? []),
    ];
    createPeer(true, null, myStream, roomName);
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
        <Stack>
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Nama Ruangan"
          />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Kamu"
          />
        </Stack>
        <Button
          disabled={!name || !roomName}
          onClick={createRoom}
          size="lg"
          colorScheme="pink"
        >
          Buat Ruangan
        </Button>
      </Stack>
    </>
  );
}
