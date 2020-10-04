module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: "src/preload.js",
      builderOptions: {
        appId: "com.thepixeldeveloper.tunnelboringmasshine",
        afterSign: "electron-builder-notarize",
        mac: {
          hardenedRuntime: true,
          entitlements:
            "./node_modules/electron-builder-notarize/entitlements.mac.inherit.plist",
        },
      },
    },
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: "Tunnel Boring MaSSHine",
    },
  },
};
