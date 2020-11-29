module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: "src/preload.js",
      builderOptions: {
        appId: "com.thepixeldeveloper.tunnelboringmasshine",
        productName: "Tunnel Boring MaSSHine",
        copyright: "Copyright © 2020 Mathew Davies",
        afterSign: "electron-builder-notarize",
        mac: {
          hardenedRuntime: true,
          category: "public.app-category.developer-tools",
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
