import _ from './npm.module.scss'
import React, {useEffect, useMemo, useState} from 'react'
import ReactDOM from 'react-dom'
import {Card} from 'antd'
import {detectPackageTypesState, PackageTypesState} from './api'
import {XBadge} from './components'

function Widget() {
  const packageName = useMemo(() => {
    return location.href.match(/package\/([^/]+)/)![1]
  }, [])
  const [packageTypesState, setPackageTypesState] = useState<PackageTypesState>(PackageTypesState.Pending)

  useEffect(() => {
    detectPackageTypesState(packageName).then(setPackageTypesState)
  }, [])

  return (
    <div className={_.main}>
      <h2>{packageName}</h2>
      <p>
        <XBadge
          label='types'
          value={
            packageTypesState === PackageTypesState.Pending
              ? 'pending'
              : packageTypesState === PackageTypesState.Missing
                ? 'missing'
                : packageTypesState === PackageTypesState.Included
                  ? 'included'
                  : `@types/${packageName}`
          }
          color={
            packageTypesState === PackageTypesState.Pending
              ? 'lightgrey'
              : packageTypesState === PackageTypesState.Missing
                ? 'red'
                : packageTypesState === PackageTypesState.Included
                  ? 'blue'
                  : 'green'
          }
        />
      </p>
      <Card title='Install' size='small' bordered={false}>
        <p>npm i {packageName}</p>
        <p>yarn add {packageName}</p>
      </Card>
    </div>
  )
}

// render
const widget = document.createElement('div')
widget.className = _.widget
document.querySelector('#app')!.parentElement!.prepend(widget)
ReactDOM.render(<Widget />, widget)
