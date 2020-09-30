import { Menu } from "electron";
import { set, values, remove } from "lodash";

export class AppTray {
  constructor(tray, sshCollection, ipc) {
    this.tray = tray;
    this.sshCollection = sshCollection;
    this.ipc = ipc;

    this.tunnels = [];
    this.connected = [];
    this.disconnected = [];
  }

  setTooltip(tooltip) {
    this.tray.setToolTip(tooltip);
  }

  update(tunnel) {
    const status = tunnel.status.toLowerCase();

    // eslint-disable-next-line no-undef
    const icon = __static + "/img/" + status + ".png";

    const click = function () {
      this.sshCollection.isConnected(tunnel)
        ? this.ipc.trayDisconnect(tunnel)
        : this.ipc.trayConnect(tunnel);
    };

    set(this.tunnels, tunnel.id, {
      label: tunnel.name,
      icon: icon,
      click: click.bind(this),
    });

    if (status === "connected") {
      this.connected.push({
        id: tunnel.id,
        disconnect: function () {
          this.ipc.trayDisconnect(tunnel);
        }.bind(this),
      });

      remove(this.disconnected, (item) => item.id === tunnel.id);
    }

    if (status === "disconnected") {
      this.disconnected.push({
        id: tunnel.id,
        connect: function () {
          this.ipc.trayConnect(tunnel);
        }.bind(this),
      });

      remove(this.connected, (item) => item.id === tunnel.id);
    }

    this.render();
  }

  render() {
    this.tray.setContextMenu(
      Menu.buildFromTemplate([
        ...[
          {
            label: "Connect All",
            enabled: this.disconnected.length > 0,
            click: function () {
              this.disconnected.forEach((v) => v.connect());
            }.bind(this),
          },
          {
            label: "Disconnect All ",
            enabled: this.connected.length > 0,
            click: function () {
              this.connected.forEach((v) => v.disconnect());
            }.bind(this),
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
