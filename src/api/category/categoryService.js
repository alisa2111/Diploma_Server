import {success, notFound} from '../../services/response';
import {Category} from './categoryController'

/**
 * params: {accountId: accountId}
 * @return account's categories
 */
export const getAllCategories = ({params}, res, next) => {
  Category.find({accountId: params.accountId})
    .then(notFound(res))
    .then(success(res))
    .catch(next)
};

export const createCategory = ({body}, res, next) => {
  return Category.create(body.category)
    .then(category => category.view(true))
    .then(success(res, 201))
    .catch(next);
};

