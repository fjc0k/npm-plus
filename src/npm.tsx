import _ from './npm.module.scss'
import React, {useEffect, useMemo, useState} from 'react'
import ReactDOM from 'react-dom'
import {Card, Select, Tag, Tooltip, Typography} from 'antd'
import {detectPackageTypesState, PackageTypesState} from './api'
import {getTypesPackageName} from './utils'
import {useStore} from './store'
import {XBadge} from './components'

function Widget() {
  const [state, setState] = useStore()
  const client = useMemo(() => {
    return state.clients.find(item => item.name === state.client)!
  }, [state.clients, state.client])
  const packageName = useMemo(() => {
    return location.href.match(/package\/(@[^/]+\/[^/]+|[^/]+)/)![1]
  }, [])
  const [packageTypesState, setPackageTypesState] = useState<PackageTypesState>(PackageTypesState.Pending)

  useEffect(() => {
    detectPackageTypesState(packageName).then(setPackageTypesState)
  }, [])

  return (
    <div className={_.main}>
      <h2 className={_.title}>{packageName}</h2>
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
                  : getTypesPackageName(packageName)
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
      <Card
        className={_.install}
        title='Install'
        size='small'
        bordered={false}
        extra={(
          <Select
            size='small'
            value={state.client}
            onChange={client => setState({client})}>
            {state.clients.map(client => (
              <Select.Option key={client.name} value={client.name}>
                {client.name}
              </Select.Option>
            ))}
          </Select>
        )}>
        <div className={`${_.item} ${_.code}`}>
          <Typography.Text copyable={true}>
            {`${client.name} ${client.installCommand} ${packageName}${
              state.devDependency
                ? ` ${client.devCommand}`
                : ''
            }${
              packageTypesState === PackageTypesState.DefinitelyTyped && state.types
                ? ` && ${client.name} ${client.installCommand} ${getTypesPackageName(packageName)} ${client.devCommand}`
                : ''
            }`}
          </Typography.Text>
        </div>
        <div className={_.item}>
          <Tooltip placement='bottomRight' title='Install as devDependency'>
            <Tag.CheckableTag checked={state.devDependency} onChange={devDependency => setState({devDependency})}>D</Tag.CheckableTag>
          </Tooltip>
          {packageTypesState === PackageTypesState.DefinitelyTyped && (
            <Tooltip placement='bottomRight' title='With types'>
              <Tag.CheckableTag checked={state.types} onChange={types => setState({types})}>T</Tag.CheckableTag>
            </Tooltip>
          )}
        </div>
        {/* <div className={_.item}>
          <a href={`https://unpkg.com/${packageName}/`} target='_blank'>Browse Files</a>
        </div> */}
      </Card>
    </div>
  )
}

// render
const widget = document.createElement('div')
widget.className = _.widget
document.querySelector('#app')!.parentElement!.prepend(widget)
ReactDOM.render(<Widget />, widget)
