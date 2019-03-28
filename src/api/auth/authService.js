import { sign } from '../../services/jwt'
import { success } from '../../services/response/'
import {Account, Invite} from '../account/accountController'
import {attachAccountToUser} from "../account/accountService";

export const login = ({ user, body }, res, next) => {
  return sign(user.id)
    .then((token) => ({ token, user: user.view(true) }))
    .then(obj => body.inviteId ? acceptInvite(obj.user, body.inviteId).then(success(res, 201)) : success(res, 201)(obj.user))
    .catch(next);
}

export const acceptInvite = (user, inviteId) =>
  new Promise((resolve, reject) => {
    Invite.findById(inviteId)
      .then(invite => {
        if (!invite) {
          reject();
        } else {
          Account.findById(invite.accountId)
            .then(account => {
              if(!account) {
                reject();
              } else {
                attachAccountToUser(account, user.id)
                  .then(user => resolve(user))
              }
            })
        }
      })
  });
