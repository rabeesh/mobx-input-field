import { observable, toJS, computed, isObservableArray } from 'mobx'
import validatorFactory from './validatorFactory'
import Error from './elements/error'

class Field {

  @observable error = ''

  constructor(val) {
    this.validators = []
    this.changed = this.changed.bind(this)
    this.rule = this.rule.bind(this)

    this._value = observable(val)
    this.changed()
  }

  @computed get value() {
    let val
    if (!isObservableArray(this._value)) {
      val = this._value.get() || ''
    } else {
      val = this._value
    }
    return val
  }

  checked(value) {
    // if checkbox array
    let checked
    if (isObservableArray(this._value)) {
      checked = this._value.indexOf(value) != -1
    } else {
      checked = this._value == value
    }
    return checked
  }

  set value(val) {
    if (isObservableArray(this._value)) {
      if (this._value.indexOf(val) !== -1) {
        this._value.remove(val)
      } else {
        this._value.push(val)    
      }
    } else {
      this._value.set(val);
    }
    this.changed()
  }

  changed() {
    this.error = ''
    // run validations
    this.validators.some(rules => {
      return Object.keys(rules).some(ruleKey => {
        const v = rules[ruleKey]

        let val
        if (isObservableArray(this._value)) {
          val = this._value
        } else {
          val = this._value.get() || ''
        }

        const { params, message } = v.rule
        const options = Array.isArray(params) ? params : []

        if (!v.validator(val, ...options)) {
          this.error = message || ruleKey + ' error'
          return true
        }
      }, this);
    }, this)
  }

  rule(exp) {
    let validator = validatorFactory(exp);
    this.validators.push(validator)
    this.changed()
    return this
  }
}

export default function createField(val) {
  return new Field(val)
}
