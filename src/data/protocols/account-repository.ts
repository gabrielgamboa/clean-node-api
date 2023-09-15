import { AccountModel } from '../../domain/models/account'
import { AddAccountModel } from '../../domain/usecases/add-account'

export interface AccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
