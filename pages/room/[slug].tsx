import React from "react";
import { Box, Stack, Heading, Avatar, Wrap, WrapItem } from "@chakra-ui/react";

const dummyData = Array(10).fill("");
const dummyListeners = Array(5).fill("");

export const RoomDetail: React.FC = () => {
  return (
    <Box>
      <Stack spacing="2rem">
        <Stack>
          <Heading size="lg">Room Name</Heading>
        </Stack>
        <Stack>
          <Box>
            <Heading size="md">Speakers ({dummyData.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="left" align="center">
            {dummyData.map((_, index) => (
              <WrapItem alignItems="center" w="calc(25% - 1.5rem)" key={index}>
                <Stack>
                  <Avatar size="lg" />
                  <Heading size="xs">Speaker {index + 1}</Heading>
                </Stack>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>

        <Stack>
          <Box>
            <Heading size="md">Listeners ({dummyListeners.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="left" align="center">
            {dummyListeners.map((_, index) => (
              <WrapItem alignItems="center" w="calc(25% - 1.5rem)" key={index}>
                <Stack>
                  <Avatar size="lg" />
                  <Heading size="xs">Listener {index + 1}</Heading>
                </Stack>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RoomDetail;
