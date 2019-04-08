import {Account, Invite} from './accountController'
import {User} from '../user/userController'
import { success, notFound } from '../../services/response/'
import {createMultipleCategories} from "../category/categoryService"
import {createMultipleSources} from "../source/sourceService";
import {sendInviteEmail} from "../../services/mailer/mailer";

/**
 * body {owner: "userId", name: string}
 * return res = user with account
 */
export const createAccount = ({ body }, res) => {
  Account.create(body)
    .then(account => account.view())
    .then(createDefaultCategories)
    .then(createDefaultSources)
    .then(account => attachAccountToUser(account, body.owner).then(() => account))
    .then(success(res, 201))
    .catch(() => res.status(400).end())
};

export const attachAccountToUser = (account, userId) => {
  const attachedAccount = {
    id: account.id,
    name: account.name,
  };

  return User.findById(userId)
    .then(user => {
      if (user) {
        if (user.accounts.find(account => account.id === attachedAccount.id)) {
          return user;
        } else {
          return Object.assign(user, user.accounts.push(attachedAccount)).save();
        }
      } else {
        return null;
      }
    });
};

const createDefaultCategories = account =>
  new Promise(resolve =>
    createMultipleCategories([
      {title: "Жильё", color: "#87b413", iconKey: "house"},
      {title: "Еда", color: "#b62f28", iconKey: "food"},
      {title: "Путешествия", color: "#2500ff", iconKey: "airplane"},
      {title: "Транспорт", color: "#d38bff", iconKey: "transport"},
      {title: "Здоровье", color: "#ffbb99", iconKey: "addCircle"},
      {title: "Подарки", color: "#b3ffff", iconKey: "gift"},
      {title: "Связь", color: "#660033", iconKey: "phone"},
      {title: "Отдых", color: "#5cd65c", iconKey: "bar"},
      {title: "Кафе", color: "#007a99", iconKey: "cafe"},
      {title: "Гигиена", color: "#004d4d", iconKey: "hygiene"},
      {title: "Одежда", color: "#ffc34d", iconKey: "offer"},
      {title: "Спорт", color: "#29a329", iconKey: "sport"}
    ].map(category => {
      category.accountId = account.id;
      return category;
    })).then(() => resolve(account)));

const createDefaultSources = account =>
  new Promise(resolve =>
    createMultipleSources([
      {title: "Наличные", type: "cash"},
      {title: "Карточка", type: "card"},
    ].map(source => {
      source.accountId = account.id;
      return source;
    })).then(() => resolve(account)));

/**
 * params {accountId: "accountId"}
 */
export const getAccount = ({params}, res, next) => {
  Account.findById(params.accountId)
    .then(notFound(res))
    .then(account => account ? account.view() : null)
    .then(success(res))
    .catch(next)
};

/**
 * params {accountId: "accountId"}
 */
export const getUsers = ({params}, res, next) => {
  User.find({accounts :  {$elemMatch: {id: params.accountId}} })
    .then(notFound(res))
    .then(success(res))
    .catch(next)
};

/**
 * body {email: string, accountId: string}
 */
export const sendInvite = ({body}, res) => {
  Invite.create(body)
    .then(invite => invite.view())
    .then(sendInviteEmail)
    .then(() => res.status(200).json({result: 'ok'}))
    .catch(() => res.status(400).end())
};
