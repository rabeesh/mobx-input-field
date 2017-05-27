import React, { Component } from 'react'
import { observer } from "mobx-react"

class Error extends Component {
  constructor(params) {
    super(params)
  }

  render() {
    const { field, showError  } = this.props
    if (!field || (showError !== undefined && showError === false)) {
      return null
    }
    return <span>{ field.error }</span>
  }
}

export default observer(Error)
