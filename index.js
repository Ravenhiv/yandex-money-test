function addToArray(array, name) {
  if (!array.includes(name)) array.push(name)
}

class Form {
  constructor(form) {
    this.isValid = true
    this.errorFields = []
    this.form = form
    this.button = this.form.elements['submitButton']
    this.nameInput = this.form.elements['fio']
    this.emailInput = this.form.elements['email']
    this.phoneInput = this.form.elements['phone']
    this.resultContainer = document.getElementById('resultContainer')

    this.form.addEventListener('submit', this.submit.bind(this))
  }

  getInputs() {
    return [this.nameInput, this.emailInput, this.phoneInput]
  }

  validate() {
    this.isValid = true
    this.getInputs().forEach(input => input.classList.remove('error'))

    this.validateName()
    this.validateEmail()
    this.validatePhone()

    return {
      isValid: this.isValid,
      errorFields: this.errorFields
    }
  }

  getData() {
    return {
      fio: this.nameInput.value,
      email: this.emailInput.value,
      phone: this.phoneInput.value
    }
  }

  setData(data = {}) {
    this.getInputs().forEach(input => {
      if (data[input.name]) input.value = data[input.name]
    })
  }

  submit(e) {
    e && e.preventDefault()
    this.validate()
    if (!this.isValid) return
    this.button.classList.add('inactive')
    fetch(this.form.action)
      .then(data => data.json())
      .then(data => {
        switch (data.status) {
          case 'success':
            this.resultContainer.classList.add('success')
            this.resultContainer.textContent = 'Success'
            break
          case 'error':
            this.resultContainer.classList.add('error')
            this.resultContainer.textContent = data.reason
            break
          case 'progress':
            this.resultContainer.classList.add('progress')
            setTimeout(this.submit.bind(this), data.timeout)
            break
          default:
            console.error('Unknown error. Please try again.')
        }
      })
  }

  validateName() {
    this.validationHelper(this.nameInput, /^([a-zа-яёЁ]+\s){2}([a-zа-яёЁ]+)$/gi)
  }

  validateEmail() {
    this.validationHelper(
      this.emailInput,
      /@ya.ru|@yandex.ru|@yandex.ua|@yandex.by|yandex.kz|yandex.com/
    )
  }

  validatePhone() {
    this.validationHelper(this.phoneInput, /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/)
    const numbersArray = this.phoneInput.value.match(/\d/g)
    let numbersSumm = 0
    numbersArray &&
      numbersArray.forEach(number => {
        numbersSumm += Number(number)
      })
    if (numbersSumm > 30) {
      this.phoneInput.classList.add('error')
      this.isValid = false
      addToArray(this.errorFields, 'phone')
    }
  }

  validationHelper(input, regExp) {
    const inputValue = input.value.trim()
    if (!inputValue.match(regExp)) {
      input.classList.add('error')
      this.isValid = false
      addToArray(this.errorFields, input.name)
    }
  }
}

const MyForm = new Form(document.getElementById('myForm'))
