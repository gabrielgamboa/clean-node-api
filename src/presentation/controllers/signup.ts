import { AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, password, passwordConfirmation, email } = httpRequest.body

      const passwordEqualsToPasswordConfirmation = password === passwordConfirmation

      if (!passwordEqualsToPasswordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.execute({
        name,
        email,
        password
      })

      return {
        statusCode: 400,
        body: {}
      }
    } catch (error) {
      return serverError()
    }
  }
}
