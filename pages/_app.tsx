import { AppProps } from "next/app";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Box bg="#f3f2ef" py="2rem" minH="100vh">
          <Box
            borderRadius="2rem"
            shadow="xl"
            p="2rem"
            h="calc(100vh - 4rem)"
            bg="white"
            mx="auto"
            overflowY="auto"
            maxWidth="480px"
          >
            <Component {...pageProps} />
          </Box>
        </Box>
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default App;
