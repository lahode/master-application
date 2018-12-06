const root = require('app-root-path').path;
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ModuleConcatPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );
const { CheckerPlugin } = require('awesome-typescript-loader');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

// import nodemon config object
const NodemonOptions = require('./server.nodemon.json')

// define server config
const SERVER_CONFIG = {
  entry_path: `${root}`, // server entry folder
  entry_file: `${root}/server.ts`, // server entry start file
  output: `${root}/dist`, // server output folder
  node_modules: `${root}/node_modules`, // node_modules folder
}

// define common webpack config for "prod" and "dev" environment
const commonConfig = {
  entry: SERVER_CONFIG.entry_file,
  target: 'node',
  externals: [
    /^[a-z\-0-9]+$/ // Ignore node_modules folder
  ],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modules: [SERVER_CONFIG.node_modules],
    plugins: [
      new TsConfigPathsPlugin({
        configFile: SERVER_CONFIG.entry_path+'/tsconfig.json',
      }),
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};

// define function to return default rules
function getProdRules() {
  return devConfig.module.rules;
}

// define webpack devConfig options
const devConfig = {
  output: {
    filename: 'server-dev.js', // output file
    path: SERVER_CONFIG.output,
    libraryTarget: "commonjs",
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              silent: true,
              useBabel: true,
              babelOptions: {
                compact: process.env.NODE_ENV === 'production',
                highlightCode: true,
              },
              babelCore: '@babel/core',
              useCache: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new NodemonPlugin(NodemonOptions)
  ]
};

// define webpack prodConfig options
const prodConfig = {
  output: {
    filename: 'server-prod.js', // output file
    path: SERVER_CONFIG.output,
    libraryTarget: "commonjs",
  },
  module: {
    rules: getProdRules()
  },
  plugins: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
};

// export webpack config
module.exports = env => {
  // define production check const
  const isProduction = env.NODE_ENV === 'production';
  console.log('[info] Webpack build production mode-> ', isProduction);
  // return new object assign with commonConfig + {env}Config
  return (isProduction)
    ? Object.assign({}, commonConfig, prodConfig)
    : Object.assign({}, commonConfig, devConfig);
}
