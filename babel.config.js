module.exports = function (api) {
  api.cache(true);
  const isDev = process.env.BABEL_ENV === "development" || process.env.NODE_ENV === "development";
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxRuntime: "automatic",
          jsxImportSource: isDev ? "@welldone-software/why-did-you-render" : "react",
        },
      ],
    ],
  };
};
