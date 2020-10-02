import ipc from "./ipc";

export async function loadTunnelStatus(tunnel) {
  tunnel.status = (await ipc.isConnected(tunnel))
    ? "Connected"
    : "Disconnected";
  return tunnel;
}
