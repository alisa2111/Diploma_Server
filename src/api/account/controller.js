import {Account} from "./index";
import {  success, notFound } from '../../services/response/';

export const createAccount = ({ bodymen: { body } }, res, next) => {
  console.log(body);
  return Account.create(body)
    .then((account) => account.view(true))
    .then(success(res, 201))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(403).json({
          valid: false,
          message: 'Oops! Creating account error!'
        })
      } else {
        next(err)
      }
    })
};
