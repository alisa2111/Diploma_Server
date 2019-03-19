import {Router} from "express";
import {
  updateSource,
  createSource,
  getSources,
  isSourceConnectedToMoneyFlows
} from "./sourceService";
import {schema} from './model';
import {failRequest, success} from "../../services/response";

export Source, {schema} from './model'

const router = new Router();

/**
 * Get all sources
 * @api {get} /sources/accountId
 * @params: {accountId}
 */
router.get('/:accountId', ({params}, res) => returnAllSources(params.accountId, res));

/**
 * Create source
 * @api {post} /sources
 * @body: {source: {all source fields}}
 */
router.post('/', ({body}, res) => {
  createSource(body.source)
    .then(source => returnAllSources(source.accountId, res, 201))
    .catch(failRequest(res))
});

/**
 * Update source
 *
 * Fields that aren't in the object won't be changed
 *
 * @api {put} /sources/
 * @body: {source: { all field to be changed placed here }
 */
router.put('/', ({body}, res) => {
  console.log('body:', body);
  updateSource(body.source)
    .then(source => returnAllSources(source.accountId, res, 202))
    .catch(failRequest(res));
});

const returnAllSources = (accountId, res, successStatusCode) =>
  getSources(accountId)
    .then(success(res, successStatusCode))
    .catch(failRequest(res));

/**
 *
 * @api {get} /sources/check/:sourceId
 * @params: {sourceId: sourceId}
 * @return: {result: resultValue (true | false)}
 */
router.get('/check/:sourceId', ({params}, res) => {
  isSourceConnectedToMoneyFlows(params.sourceId)
    .then(success(res))
    .catch(failRequest(res));
});

export default router;
