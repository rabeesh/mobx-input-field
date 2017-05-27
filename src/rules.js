import validator from 'validator'

export const rules = {
    required: {
        validator: function (str) {
            return !validator.isEmpty(str)
        }
    }
}


export const extendRules = (newRules) => {
    if (typeof newRules !== 'object') {
        throw new Error('Rules should be object')
    }

    const hasValidator = Object.keys(newRules).some(key => {
        if (rules.hasOwnProperty(key) && newRules[key].validator) {
            return true
        }
    })

    // Not allowed to extend validator 
    if (hasValidator) {
        throw new Error('Not allowed to extend validator')
    }

    Object.keys(newRules).forEach(key => {
        if (rules.hasOwnProperty(key)) {
            Object.assign(rules[key], newRules[key])
        } else {
            rules[key] = newRules[key]
        }
    })    
}