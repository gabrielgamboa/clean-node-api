import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  test('Should return false if validato returns false', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })
})
