import _ from './Badge.module.scss'
import React from 'react'

export interface XBadgeProps {
  label: string,
  value: string,
  color: 'black' | 'blue' | 'brightgreen' | 'red' | 'orange' | 'green' | 'yellowgreen' | 'yellow' | 'lightgrey',
}

export function XBadge(props: XBadgeProps) {
  return (
    <div className={_.badge}>
      <div className={_.label}>
        {props.label}
      </div>
      <div className={`${_.value} ${_[props.color]}`}>
        {props.value}
      </div>
    </div>
  )
}
