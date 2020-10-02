import { Menu } from "electron";
import { set, unset, values } from "lodash";

export class AppTray {
  constructor(tray, sshCollection, ipc) {
    this.tray = tray;
    this.sshCollection = sshCollection;
    this.ipc = ipc;

    this.tunnels = [];
    this.connected = [];
    this.disconnected = [];
  }

  registerTunnel(tunnel) {
    // eslint-disable-next-line no-undef
    const icon = __static + "/img/" + tunnel.status.toLowerCase() + ".png";

    function clickHandler() {
      return this.sshCollection.isConnected(tunnel)
        ? this.ipc.trayDisconnect(tunnel)
        : this.ipc.trayConnect(tunnel);
    }

    set(this.tunnels, tunnel.id, {
      label: tunnel.name,
      icon: icon,
      click: clickHandler.bind(this),
    });
  }

  updateConnectAll(tunnel) {
    if (tunnel.status === "Connected") {
      const clickHandler = function () {
        return this.ipc.trayDisconnect(tunnel);
      };

      set(this.connected, tunnel.id, {
        id: tunnel.id,
        disconnect: clickHandler.bind(this),
      });

      unset(this.disconnected, tunnel.id);
    }
  }

  updateDisconnectAll(tunnel) {
    if (tunnel.status === "Disconnected") {
      const clickHandler = function () {
        return this.ipc.trayConnect(tunnel);
      };

      set(this.disconnected, tunnel.id, {
        id: tunnel.id,
        connect: clickHandler.bind(this),
      });

      unset(this.connected, tunnel.id);
    }
  }

  connectAllEnabled() {
    return values(this.disconnected).length > 0;
  }

  disconnectAllEnabled() {
    return values(this.connected).length > 0;
  }

  connectAll() {
    return values(this.disconnected).forEach((tunnel) => tunnel.connect());
  }

  disconnectAll() {
    return values(this.connected).forEach((tunnel) => tunnel.disconnect());
  }

  update(tunnel) {
    this.registerTunnel(tunnel);
    this.updateConnectAll(tunnel);
    this.updateDisconnectAll(tunnel);
    this.render();
  }

  render() {
    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        ...[
          {
            label: "Connect All",
            enabled: this.connectAllEnabled(),
            click: this.connectAll.bind(this),
          },
          {
            label: "Disconnect All ",
            enabled: this.disconnectAllEnabled(),
            click: this.disconnectAll.bind(this),
          },
          {
            type: "separator",
          },
        ],
        ...values(this.tunnels),
      ])
    );
  }
}
