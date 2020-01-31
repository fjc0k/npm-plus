import {Config} from 'poi'

const config: Config = {
  pages: {
    background: {
      entry: './src/background.ts',
    },
    api: {
      entry: './src/api.ts',
    },
  },
  output: {
    dir: './dist',
    sourceMap: false,
    clean: true,
    fileNames: {
      js: '[name].js',
      css: '[name].css',
      font: '[name].[ext]',
      image: '[name].[ext]',
    },
  },
}

export default config
