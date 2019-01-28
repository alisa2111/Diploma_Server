import {Account} from "./index";
import {User} from "../user";
import { success, notFound } from '../../services/response/';

// body {owner: "userId"}
export const createAccount = ({ body }, res, next) => {
  User.findById(body.owner)
    .then(notFound(res))
    .then(user => {
      if (user) {
        Account.create(body)
          .then(account => account.view(true))
          .then(account => Object.assign(user, user.accounts.push(account.id)).save())
          .then(success(res, 201))
          .catch(next)
      }
    })
    // [TODO] change status code
    .catch(() => res.status(409).end())
};
