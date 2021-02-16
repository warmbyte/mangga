import React from "react";
import { Box, Stack, Heading, Avatar, Wrap, WrapItem } from "@chakra-ui/react";

const dummyData = Array(5).fill("");
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
            <Heading size="sm">Speakers ({dummyData.length})</Heading>
          </Box>
          <Wrap spacing="1.5rem" justify="flex-start" align="center">
            {dummyData.map((_, index) => (
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

        <Stack>
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
        </Stack>
      </Stack>
    </Box>
  );
};

export default RoomDetail;
