export const broadcast = (message: any) => {
  Array.from(window["peer"]._connections.entries()).forEach((a) => {
    a[1]?.[0]?.send?.(message);
  });
};
