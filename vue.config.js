module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: "src/preload.js",
    },
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: "Tunnel Boring MaSSHine",
    },
  },
};
