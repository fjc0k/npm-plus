import {Config} from 'poi'

const isDev = process.env.GENERATE_ENV === 'dev'

const config: Config = {
  pages: {
    background: {
      entry: './src/background.ts',
    },
    npm: {
      entry: './src/npm.tsx',
    },
  },
  output: {
    dir: './dist',
    sourceMap: false,
    clean: !isDev,
    fileNames: {
      js: '[name].js',
      css: '[name].css',
      font: '[name].[ext]',
      image: '[name].[ext]',
    },
  },
}

export default config
