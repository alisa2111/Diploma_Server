import {Source} from "./sourceController";
import { success, notFound } from '../../services/response';

export const createSource = ({body}, res, next) => {
  return Source.create(body.source)
    .then(source => source.view(true))
    .then(success(res, 201))
    .catch(next);
};

/**
 * params: {accountId: accountId}
 */
export const getSources = ({params}, res, next) => {
  Source.find({accountId: params.accountId})
    .then(notFound(res))
    .then(res => res.map(r => r.view()))
    .then(success(res))
    .catch(next);
};

export const updateSourceAmount = ({params}, res, next) => {
  Source.findById(params.sourceId)
    .then(source => {
      source.balance = params.balance;
      return source;
    })
    .then(updatedSource => updatedSource.save())
    .then(() => getSources({params}, res, next))
    .catch(() => res.status(409).end())
};

export const updateSource = moneyFlow => {
  const {amount} = moneyFlow;
  return Source.findById(moneyFlow.sourceId)
    .then(source => {
      moneyFlow.type === "expense" ? source.balance -= amount : source.balance += amount;
      return source;
    })
    .then(updatedSource => updatedSource.save())
};
