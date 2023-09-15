import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountRepository } from '../../protocols/account-repository'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly accountRepository: AccountRepository
  ) {
  }

  async execute (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    await this.accountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return await new Promise(resolve => {
      resolve({
        id: accountData.email,
        name: accountData.name,
        email: accountData.email,
        password: accountData.password
      })
    })
  }
}
