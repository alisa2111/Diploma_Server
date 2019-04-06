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
        if (!s) {
          reject(404);
        }
        source.balance = Math.round(source.balance * 100) / 100;
        Object.assign(s, source);
        resolve(s.save());
      })
      .catch(reject);
  });

export const updateSourceBalance = moneyFlow => {
  const {amount} = moneyFlow;
  return Source.findById(moneyFlow.sourceId)
    .then(source => {
      const newAmount = moneyFlow.type === "expense" ? source.balance - amount : source.balance + amount;
      source.balance = Math.round(newAmount * 100) / 100;
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

export const replaceSource = (sourceId, replaceTo) => {
  return new Promise((resolve, reject) => {
    MoneyFlow.updateMany(
      {sourceId: sourceId},
      {$set: {sourceId: replaceTo}}
    ).then(res => {
      if (!res.ok) {
        reject();
      }
      return res;
    })
      .then(() => {
        Source.findById(sourceId)
          .then(sourceToDelete => {
            Source.findById(replaceTo)
              .then(sourceReplaceTo => {
                sourceReplaceTo.balance += sourceToDelete.balance;
                sourceReplaceTo.save();
                resolve();
              })
          })
      })
  });
};

export const deleteSource = (sourceId) => {
  return new Promise((resolve, reject) => {
    isSourceConnectedToMoneyFlows(sourceId)
      .then(result => {
        if (result.connected) {
          reject(403);
        } else {
          Source.findOneAndRemove({_id: sourceId})
            .then(res => {
              if (res) {
                resolve(res);
              } else {
                reject(404);
              }
            })
            .catch(reject)
        }
      })
      .catch(reject);
  });
};
