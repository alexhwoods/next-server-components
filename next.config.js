// const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin')
const ReactServerWebpackPlugin = require('./build/react-server-dom-webpack-plugin')
const fs = require('fs')

let manifest

const PLUGIN_NAME = 'CopyReactClientManifest'
class CopyReactClientManifest {
  apply(compiler) {

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      const asset = compilation.getAsset('react-client-manifest.json')
      const content = asset.source.source()
      // there might be multiple passes (?)
      // we keep the larger manifest
      if (manifest && content && manifest.length > content.length) {
        callback()
        return
      }
      manifest = content
      fs.writeFile('./libs/react-client-manifest.json', content, callback)
      // compilation.emitAsset('./libs/react-client-manifest.json', sources.RawSource(content))
    })
  }
}

module.exports = {
  experimental: {
    reactRoot: true,
  },
  api: {
    bodyParser: false,
  },
  webpack: config => {
    config.plugins.push(new ReactServerWebpackPlugin({ isServer: false }))
    config.plugins.push(new CopyReactClientManifest())
    return config
  },
}
