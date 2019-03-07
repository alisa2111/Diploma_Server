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

/**
 * body: {category: {accountId, color, title, iconKey}}
 * @return created category
 */
export const createCategory = ({body}, res, next) => {
  return Category.create(body.category)
    .then(category => category.view(true))
    .then(success(res, 201))
    .catch(next);
};

/**
 * params: {categoryId: categoryId}
 * body: {category: fields for updating}
 * @return updated category
 */
export const updateCategory = ({params, body}, res, next) => {
  Category.findById(params.categoryId)
    .then(notFound(res))
    .then(category => category ? Object.assign(category, body.category).save() : null)
    .then(category => category ? category.view(true) : null)
    .then(success(res))
    .catch(next)
};

/**
 * params: {categoryId: categoryId}
 */
export const deleteCategory = ({params}, res, next) => {
  Category.findById(params.categoryId)
    .then(notFound(res))
    .then(category => category ? category.remove() : null)
    .then(success(res, 204))
    .catch(next)
};

