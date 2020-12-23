import React from "react";

import {Typography} from "antd";
import "antd/es/typography/style/css";
const {Text} = Typography


export function render(v) {
  return { value: v, label: v }
}

export function renderIndividual(i) {
  return {
    value: String(i.id),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {i.label}{' '}
        <Text type="secondary">{i.id}</Text>
      </div>
    )
  }
}

export function renderContainer(c) {
  return {
    value: String(c.id),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {c.name}{' '}
        <Text type="secondary">{c.id}</Text>
      </div>
    )
  }
}

export function renderSample(s) {
  return {
    value: String(s.id),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {s.name}{s.alias && <small> (alias: {s.alias})</small>}{' '}
        </span>
        <Text type="secondary">{s.id}</Text>
      </div>
    )
  }
}
