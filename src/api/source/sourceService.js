import {Source} from "./sourceController";
import {MoneyFlow} from "../moneyFlow/moneyFlowController";

export const createSource = source => {
  return new Promise((resolve, reject) => {
    Source.create(source)
      .then(source => resolve(source.view()))
      .catch(reject);
  });
};

/**
 * params: {accountId: accountId}
 */
export const getSources = accountId =>
  new Promise((resolve, reject) => {
    Source.find({accountId: accountId})
      .then(res => resolve(res.map(r => r.view())))
      .catch(reject);
  });

export const updateSource = source =>
  new Promise((resolve, reject) => {
    Source.findById(source.id)
      .then(s => {
        console.log(s);
        if (!s) {
          reject(404);
        }
        Object.assign(s, source);
        resolve(s.save());
      })
      .catch(reject);
  });

export const updateSourceBalance = moneyFlow => {
  const {amount} = moneyFlow;
  return Source.findById(moneyFlow.sourceId)
    .then(source => {
      moneyFlow.type === "expense" ? source.balance -= amount : source.balance += amount;
      return source;
    })
    .then(updatedSource => updatedSource.save())
};

export const isSourceConnectedToMoneyFlows = (sourceId) => {
  return new Promise((resolve, reject) => {
    MoneyFlow.findOne({sourceId: sourceId})
      .then(mf => resolve({connected: !!mf}))
      .catch(reject)
  });
};
