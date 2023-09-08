import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.execute({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
