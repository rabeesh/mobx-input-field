import validator from 'validator'
import { rules as alias } from './rules'

const ucFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function validatorFactory(rules) {
  const mappedRules = []

  Object.keys(rules).forEach(key => {
    let rule = rules[key]

    if (alias.hasOwnProperty(key)) {
      return mappedRules.push({
          validator: alias[key].validator,
          rule: Object.assign({}, alias[key], rule)
      })
    } else if (validator[key] || validator['is' + ucFirst(key)]) {
      return mappedRules.push({
          validator: validator[key] || validator['is' + ucFirst(key)],
          rule: rule
      })
    } else if (key == 'customRules') {
      return rule.forEach((customRule) => {
        mappedRules.push({
            validator: (...args) => {
              return !customRule.validator(...args)
            },
            rule: customRule
        })
      })
    }
    throw new Error(key + ': Validator is not exists');
  })

  return mappedRules
}