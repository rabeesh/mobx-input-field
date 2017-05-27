import React, { Component } from 'react'
import { observer } from "mobx-react"
import { toJS, isObservableArray } from 'mobx'

class Field extends Component {

  constructor(params) {
    super(params)
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onChange(e) {
    this.props.field.value = e.target.value
  }

  onBlur(e) {
    if (this.props.field.format) {
      this.props.field.format()
    }
  }

  render() {
    const { field, type, value, children, ...rest } = this.props

    if (type == 'select') {
      return (
        <select {...rest} value={field.value} onChange={this.onChange}>
          { children }
        </select>
      )
    }

    if (type == "textarea") {
      return <textarea
        { ...rest }
        onBlur={this.onBlur}
        onChange={this.onChange}
        value={field.value}
      ></textarea>
    }

    if (type == 'radio') {
      return <input
        { ...rest }
        type={type}
        onBlur={this.onBlur}
        onChange={this.onChange}
        checked={field.value == value}
        value={value}
      />
    } else if(type == 'checkbox') {
      return <input
        { ...rest }
        type={type}
        onBlur={this.onBlur}
        onChange={this.onChange}
        checked={field.checked(value)}
        value={value}
      />
    } else {
      return <input
        { ...rest }
        type={type}
        onBlur={this.onBlur}
        onChange={this.onChange}
        value={field.value}
      />
    }
  }
}

export default observer(Field)
