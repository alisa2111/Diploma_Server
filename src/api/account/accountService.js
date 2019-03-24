import {Account, Invite} from './accountController'
import {User} from '../user/userController'
import { success, notFound } from '../../services/response/'
import {createCategory} from "../category/categoryService"
import {createSource} from "../source/sourceService";
import {sendInviteEmail} from "../../services/mailer/mailer";

/**
 * body {owner: "userId", name: string}
 * return res = user with account
 */
export const createAccount = ({ body }, res) => {
  Account.create(body)
    .then(account => account.view())
    .then(account => {
      // TODO chain
      createDefaultCategories(account.id);
      createDefaultSources(account.id);
      attachAccountToUser(account, body.owner);
      return account;
    })
    .then(success(res, 201))
    .catch(() => res.status(400).end())
};

const attachAccountToUser = (account, userId) => {
  const attachedAccount = {
    id: account.id,
    name: account.name,
  };

  return User.findById(userId)
    .then(user => user ? Object.assign(user, user.accounts.push(attachedAccount)).save() : null);
};

const createDefaultCategories = accountId =>
  [
    {accountId, title: "Жильё", color: "#87b413", iconKey: "house"},
    {accountId, title: "Еда", color: "#b62f28", iconKey: "food"},
    {accountId, title: "Путешествия", color: "#2500ff", iconKey: "airplane"},
    {accountId, title: "Транспорт", color: "#d38bff", iconKey: "transport"},
    {accountId, title: "Здоровье", color: "#ffbb99", iconKey: "addCircle"},
    {accountId, title: "Подарки", color: "#b3ffff", iconKey: "gift"},
    {accountId, title: "Связь", color: "#660033", iconKey: "phone"},
    {accountId, title: "Отдых", color: "#5cd65c", iconKey: "bar"},
    {accountId, title: "Кафе", color: "#007a99", iconKey: "cafe"},
    {accountId, title: "Гигиена", color: "#004d4d", iconKey: "hygiene"},
    {accountId, title: "Одежда", color: "#ffc34d", iconKey: "offer"},
    {accountId, title: "Спорт", color: "#29a329", iconKey: "sport"}
  ].forEach(category => createCategory(category));

const createDefaultSources = accountId =>
  [
    {accountId, title: "Наличные", type: "cash"},
    {accountId, title: "Карточка", type: "card"},
  ].forEach(source => createSource(source));

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
 * body {email: string, accountId: string}
 */
export const sendInvite = ({body}, res) => {
  Invite.create(body)
    .then(invite => invite.view())
    .then(sendInviteEmail)
    .then(() => res.status(200).json({result: 'ok'}))
    .catch(() => res.status(400).end())
};
