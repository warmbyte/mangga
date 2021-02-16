import { Stack, Button, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
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
      <Button size="lg" colorScheme="pink">
        Buat Ruangan
      </Button>
    </Stack>
  );
}
