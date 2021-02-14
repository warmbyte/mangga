import { useState, useRef } from "react";
import { Container, Stack, Button, Heading, Input } from "@chakra-ui/react";

export default function Home() {
  const [connectionId, setConnectionId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [joinedCall, setJoinedCall] = useState(false);
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  const handleCall = () => {
    // @ts-ignore
    const peer = new Peer();
    const getUserMedia = navigator.getUserMedia;
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        const call = peer.call(roomId, stream);
        call.on("stream", function (remoteStream) {
          setJoinedCall(true);
          videoRef.current.srcObject = remoteStream;
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  };

  const connect = () => {
    const getUserMedia = navigator.getUserMedia;
    // @ts-ignore
    peerRef.current = new Peer();
    const peer = peerRef.current;

    peer.on("open", function () {
      if (peer.id) {
        console.log("connection id", peer.id);
        setConnectionId(peer.id);
      }
    });

    // startCapture().then((stream) => {
    //   console.log(stream);
    //   videoRef.current.srcObject = stream;

    //   peer.on("call", function (call) {
    //     call.answer(stream);
    //   });
    // });

    peer.on("call", function (call) {
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          call.answer(stream);
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );

      call.on("stream", function (remoteStream) {
        videoRef.current.srcObject = remoteStream;
      });
    });
  };

  // function startCapture() {
  //   // @ts-ignore
  //   return navigator.mediaDevices.getDisplayMedia(null);
  // }

  return (
    <Container maxW="5xl">
      <Stack
        display={connectionId || joinedCall ? "none" : undefined}
        minH="100vh"
        spacing="3rem"
        justify="center"
        align="center"
      >
        <Heading>Google Meet Clone</Heading>
        <Stack direction="row">
          <Input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            type="text"
            placeholder="room id"
          />
          <Button onClick={handleCall} colorScheme="pink">
            Call
          </Button>
        </Stack>
        <Button onClick={connect} colorScheme="blue" size="lg">
          Become Host
        </Button>
      </Stack>
      <video ref={videoRef} autoPlay controls />
    </Container>
  );
}
