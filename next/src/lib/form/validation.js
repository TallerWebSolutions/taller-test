import * as R from 'ramda'
import { every } from 'conducer'
// import isURL from 'is-url'

const isEmpty = value => typeof value === 'undefined' ||
  (Array.isArray(value) && value.length === 0) ||
  value === null ||
  value === ''

const isNotEmpty = R.complement(isEmpty)
const isNotEmail = value => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
// const isNotNumeric = value => !/^(\d+(\.\d+)?)$/.test(value)
// const isNotInteger = value => Number(value) !== Math.floor(value)
// const isNotURL = R.complement(isURL)

/*
 * Validation rules.
 */

export const nil = () => undefined
export const required = value => isEmpty(value) && 'Required'
// export const url = value => every([isNotEmpty, isNotURL])(value) && 'Invalid URL'
export const email = value => every([isNotEmpty, isNotEmail])(value) && 'Must be a valid e-mail'
// export const number = value => every([isNotEmpty, isNotNumeric])(value) && 'Digite apenas números'
// export const integer = value => number(value) || isNotInteger(value) && 'Digite apenas números inteiros'
// export const checked = value => !value && 'Este campo deve estar marcado'
// export const min = min => value => value < min && `Número deve ser maior ou igual a ${min}`
// export const max = max => value => value >= max && `Número deve ser menor que ${max}`

export const equalsField = (field, label) => (value, values) =>
  value !== values[field] && `Must equal field ${label}`

// export const oneOf = (options = [], error = 'Opção inválida', caseSensitive = true) =>
//   value => options
//     .map(str => caseSensitive ? str : str.toLowerCase())
//     .indexOf(caseSensitive ? value : value && value.toLowerCase()) === -1 && error

// export const maxLength = max => value => {
//   if (!isEmpty(value) && value.length > max) {
//     return `Não deve ter mais de ${max} caracteres`
//   }
// }

export const minLength = min => value => {
  if (!isEmpty(value) && value.length < min) {
    return `Must have at least ${min} characters`
  }
}

/*
 * Combine multiple validation rules into one..
 */
export const combine = rules => (...args) => {
  const _rules = [].concat(rules)

  for (let i = 0; i < _rules.length; i++) {
    const error = _rules[i](...args)
    if (error) return error
  }
}

/**
 * Conditionally validates a field.
 *
 * @param {Function} condition Callback to check if should validate. Receives the field
 *                             value as first argument and the whole form data as second.
 * @param {Array|Function} rules Either a single rule function or an array of rules.
 *
 * @return {Function} A configured conditional rule.
 */
export const condition = (condition, rules) => (...args) =>
  condition(...args) ? combine(rules)(...args) : undefined

/**
 * Branch validate based on field current value.
 *
 * @param {Function} test Branch predicate.
 * @param {Array|Function} leftRules Rules to apply when predicates true.
 * @param {Array|Function} rightRules Rules to apply when predicates false.
 */
export const branch = (test, leftRules, rightRules = nil) => (...args) =>
  combine(test(...args) ? leftRules : rightRules)(...args)
