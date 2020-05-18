import {axios} from "../DukaanAPI";
import ErrorHandler from "../helpers/ErrorHandler";

const querystring = require('querystring');

/**
 * Fetches the products from the server
 * @param {object} queryParams - Search filter params to be sent
 * @return {Promise<Array>} response - Promise with the response
 */
const handleGetProducts = (queryParams, pageInfo) => {
    let moreTypes = ''
    if (queryParams.type === 'course') {
        moreTypes = `&type=PREMIUM&type=LITE`
    }
    const query = querystring.stringify(queryParams);
    return axios.get(`/api/v2/admin/products?page=` + pageInfo.page + `&limit=` + pageInfo.limit + `&` + query + moreTypes).then((r) => {
        return {
            results: r.data.products,
            pagesInfo: r.data.pagesInfo
        }
    }).catch((error) => {
        ErrorHandler.handle(error)
    });

}

export const searchProducts = (queryParams) => {
    const query = querystring.stringify(queryParams);
    return axios.get(`/api/v2/admin/products/search?${query}`)
}

/**
 * Saves the product edits on the server
 * @param {object} queryParams – Save data to be sent
 * @return {Promise<string>} response – Returns if the request was
 *  successful or not
 */
const handleEditProduct = (queryParams) => {
    const id = queryParams.id;
    delete queryParams.id;
    delete queryParams.created_at;
    delete queryParams.updated_at;
    delete queryParams.deleted_at;
    delete queryParams.tax_id;
    delete queryParams.updated_by;
    delete queryParams.owner_user_id;
    delete queryParams.extension_of;
    delete queryParams.duration;
    delete queryParams.product_extensions;
    Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] == null) {
            queryParams[key] = "";
        }
        if (typeof (queryParams[key]) == 'number' || typeof (queryParams[key]) == 'boolean') {
            queryParams[key] = queryParams[key].toString();
        }
        if (typeof (queryParams[key]) == 'array') {
            queryParams[key] = queryParams[key].map((p) => {
                return p.toString();
            });
        }
    });

    let response = new Promise((resolve, reject) => {
        axios.patch(`/api/v2/admin/products/` + id, queryParams).then((r) => {
            queryParams.id = id;
            resolve(r);
        }).catch((error) => {
            queryParams.id = id;
            console.log(error);
            console.log(error.response.data);
            reject(ErrorHandler.handle(error));
        });
    });

    return response;
};

/**
 * Adds the product to the server
 * @param {object} queryParams – Save data to be sent
 * @return {Promise<string>} response – Returns if the request was
 *  successful or not
 */
const handleAddProduct = (queryParams) => {
    Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] == null) {
            queryParams[key] = "";
        }
        if (typeof (queryParams[key]) == 'number' || typeof (queryParams[key]) == 'boolean') {
            queryParams[key] = queryParams[key].toString();
        }
        if (typeof (queryParams[key]) == 'array') {
            queryParams[key] = queryParams[key].map((p) => {
                return p.toString();
            });
        }
    });
    let response = new Promise((resolve, reject) => {
        axios.post(`/api/v2/admin/products/`, queryParams).then((r) => {
            resolve(r);
        }).catch((error) => {
            reject(ErrorHandler.handle(error));
        });
    });
    return response;
}

/**
 * Calculate price of products on the server
 * @param {object} formBody – params required for calculating
 *  the price of the server
 * @return {Promise<object>} response
 */
const handleCalculatePrice = (formBody) => {
    let queryString = querystring.stringify(formBody);
    return axios.post("/api/v2/admin/products/calculate", queryString);
}


module.exports = {
    handleGetProducts,
    handleAddProduct,
    handleEditProduct,
    handleCalculatePrice,
    searchProducts
}
