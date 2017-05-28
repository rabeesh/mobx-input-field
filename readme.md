# mobx-input-field

mobx-input-field, configureable validation store on top of `mobx`, `mobx-react`, and [validator.js](https://github.com/chriso/validator.js/). You can simply add your own custom rules.

## Installation
```npm install --save mobx-input-field```

## input store
```js
import { validatedGroup, field, extendRules } from 'mobx-input-field'

extendRules({
  usPhoneNo: {
    validator:  (phoneNumber) => {
      if (!phoneNumber) { return true; }
      if (typeof (phoneNumber) !== 'string') { return false; }
      phoneNumber = phoneNumber.replace(/\s+/g, "");
      return phoneNumber.length > 9 &&
        phoneNumber.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
    },
    message: 'US phone number is invalid'
  }
})

const validated = validatedGroup({
  firstname: field().rule({
    required: {'message': 'Firstname is required' }
  }),
  lastname: field().rule({
    required: {'message': 'Lastname is required' }
  }),
  email: field().rule({
    required: {'message': 'Email is required' },
    email: { 'message': 'Email is invalid' }
  }),
  address: field().rule({
    required: { 'message': 'Address is required' }
  }),
  zip: field().rule({
    required: { 'message': 'Zip is required' },
    length: {
      'params': [{ min:6, max: 8 }],
      'message': 'Zip is invalid, should be 6~8 chars'
    }
  }),
  phone: field().rule({
    usPhoneNo: {}
  }),
  city: field(),
  gender: field(),
  communication: field(['email']).rule({
    customRules: [{
      validator: function (arr) {
          return arr.length == 0;
      },
      'message': 'Atleast one communication method is required'
    }]
  }),
  country: field('').rule({
    required: {
      'message': 'Country is required'
    },
    customRules: [{
        validator: function (val) {
            return val.toLowerCase() !== 'us';
        },
        message: 'Only supported in United States'
    }]
  })
})
```

## Validation methods

It will supports validation methods of [validator.js](https://github.com/chriso/validator.js/).

```js
// validator js function `isAscii` can be defined as
field().rule({
  ascii: {
    'message': 'Title is invalid'
  }
})

// validator js function `isAscii`
field().rule({
  isAscii: {
    'message': 'Title is invalid'
  }
})

```


## Usage - Example Form
```js
export default class Address extends Component {

  constructor(params) {
    super(params)
    this.submit = this.submit.bind(this)
  }

  submit() {
    // show validation error
    const { validated } = this.props

    // show errors on submit click
    validated.showError = true
    if (validated.errors.length > 0) {
      return false
    }

    // print json data
    console.log(validated.toJS())
  }


  render() {
    const { validated } = this.props
    const fields = validated.fields

    return (
      <form>
        <div>
          Firstname
          <Field type="text" field={ fields.firstname } />
          <fields.firstname.Error />
        </div>
        <div>
          Lastname
          <Field type="text" field={ fields.lastname } />
          <fields.lastname.Error />
        </div>
        <div>
          Email
          <Field type="text" field={ fields.email } />
          <fields.email.Error />
        </div>

        <div>
          Address
          <Field type="text" field={ fields.address } />
          <fields.address.Error />
        </div>

        <div>
          Zip
          <Field type="text" field={ fields.zip } />
          <fields.zip.Error />
        </div>

        <div>
          Phone
          <Field type="text" field={ fields.phone } />
          <fields.phone.Error />
        </div>

        <div>
          Gender
          <Field type="radio" value="male" field={ fields.gender } value="male" />
            {' '}
            Male
          <Field type="radio" value="male" field={ fields.gender } value="female"/>
            {' '}
            Female
        </div>
        <div>
          Prefered communication
          <Field type="checkbox" field={ fields.communication } value="email" />
          {' '} Email
          <Field type="checkbox" field={ fields.communication } value="sms" />
          {' '} Sms
          <fields.communication.Error />
        </div>
        <div>
          City
          <Field type="text" field={ fields.city } />
          <fields.city.Error />
        </div>

        <div>
          Country
          <Field type="select" field={ fields.country }>
            <option value="">Select a country</option>
            <option value="in">India</option>
            <option value="us">United States</option>
            <option value="ch">Chiana</option>
          </Field>
          <fields.country.Error />
        </div>

        <button onClick={this.submit}>Submit</button>
      </form>
    )
  }
}
```

### MIT
