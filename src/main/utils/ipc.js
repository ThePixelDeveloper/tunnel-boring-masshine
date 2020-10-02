import { app, dialog, ipcMain } from "electron";

const os = require("os");

function registerHandlers(win, appTray, sshCollection) {
  ipcMain.on("tray.update", (event, tunnels) => {
    appTray.update(tunnels);
  });

  ipcMain.on("register", (event, tunnel) => {
    sshCollection.register(
      tunnel,
      function (id) {
        event.sender.send("connected", id);
      },
      function (id) {
        event.sender.send("disconnected", id);
      },
      function (id, error) {
        event.sender.send("error", id, error);
      }
    );

    event.sender.send("register.response");
  });

  ipcMain.on("connect", (event, tunnel) => {
    sshCollection.connect(tunnel);
  });

  ipcMain.on("disconnect", (event, tunnel) => {
    sshCollection.disconnect(tunnel);
  });

  ipcMain.on("isConnected", (event, tunnel) => {
    event.sender.send(
      "isConnected.response",
      sshCollection.isConnected(tunnel)
    );
  });

  ipcMain.on("privateKeyDialog", async (event) => {
    const privateKey = dialog.showOpenDialogSync({
      defaultPath: os.homedir() + "/.ssh",
      properties: ["openFile", "showHiddenFiles", "dontAddToRecent"],
    });

    if (privateKey !== undefined && privateKey.length === 1) {
      event.sender.send("privateKeyDialog.response", privateKey[0]);
    }
  });

  ipcMain.on("config.read", async (event) => {
    const path = require("path").join(app.getPath("userData"), "tunnels.json");

    try {
      await require("fs").promises.access(path);

      event.sender.send(
        "config.read.response",
        JSON.parse(await require("fs").promises.readFile(path, "utf-8"))
      );
    } catch (e) {
      event.sender.send("config.read.response", e);
    }
  });

  ipcMain.on("config.write", async (event, config) => {
    const tunnelsPath = require("path").join(
      app.getPath("userData"),
      "tunnels.json"
    );
    return await require("fs").promises.writeFile(
      tunnelsPath,
      JSON.stringify(config)
    );
  });
}

function registerFunctions(win) {
  function trayConnect(tunnel) {
    win.webContents.send("tray.connect", tunnel);
  }

  function trayDisconnect(tunnel) {
    win.webContents.send("tray.disconnect", tunnel);
  }

  return {
    trayConnect,
    trayDisconnect,
  };
}

export default {
  registerHandlers,
  registerFunctions,
};
