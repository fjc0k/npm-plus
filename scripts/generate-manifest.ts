import fs from 'fs-extra'
import path from 'path'
import {chromeExtensionManifest, description, displayName, version} from '../package.json'

const distDir = path.resolve(__dirname, '../dist')

chromeExtensionManifest.name = displayName
chromeExtensionManifest.version = version
chromeExtensionManifest.description = description

fs.ensureDirSync(distDir)

fs.writeJSONSync(
  path.join(distDir, 'manifest.json'),
  chromeExtensionManifest,
  {
    spaces: 2,
  },
)
