const path = require('path');

const loaders = [];

loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: 'babel-loader',
});

loaders.push({
  test: /\.(ts|tsx)$/,
  exclude: /node_modules/,
  loader: 'ts-loader',
  options: {
    configFile: 'tsconfig.json',
  },
});

loaders.push({
  test: /\.s[ac]ss$/i,
  use: [
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    'css-loader',
    // Compiles Sass to CSS
    'sass-loader',
  ],
});

loaders.push({
  test: /\.css$/i,
  use: ['style-loader', 'css-loader'],
});

loaders.push({
  test: /\.(png|ico|jpe?g|gif)$/i,
  use: [
    {
      loader: 'file-loader',
    },
  ],
});

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: loaders,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(path.resolve(), './public'),
  },
};
