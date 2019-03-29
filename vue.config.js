module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(frag|vert|glsl)$/,
          use: 'raw-loader',
        },
      ],
    },
  },
};
