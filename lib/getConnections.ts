export const getConnections = () =>
  Array.from(window["peer"]._connections.entries()).map((a) => {
    return a[0];
  });
