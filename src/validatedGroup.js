import React, { Component, PropTypes } from 'react'
import { observable, toJS, computed } from 'mobx'
import Error from './elements/error'
import { observer } from "mobx-react"

class ValidatedGroup {
  @observable props = {
    showError: false
  }

  constructor(fields) {
    const group = this
    Object.keys(fields).forEach(fieldName => {
      return fields[fieldName].Error = observer(function () {
        return <Error showError={group.props.showError} field={fields[fieldName]} />
      })
    })
    this.fields = fields
  }

  @computed get values() {
    const fields = this.fields
    return Object.keys(fields).reduce((obj, key) => {
      obj[key] = fields[key].value
      return obj
    }, {})
  }

  toJS() {
    return toJS(this.values)
  }

  getFields() {
    return this.fields
  }

  @computed get errors() {
    const fields = this.fields
    return Object.keys(fields).filter(fieldName => {
      return fields[fieldName].error
    })
  }
}

export default function createValidatedGroup(fields) {
  return new ValidatedGroup(fields);
}