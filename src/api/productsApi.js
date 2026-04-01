import api from "./api";

/**
 * Products & Categories API
 * Base: https://staging.apnadukan.com/api
 */

/** Shopkeeper's shops (maps to public.shops) */
export const getMyShops = async () => {
  //const { data } = await api.get("/shops");
  //return data;
};

/** Get products for a shop */
export const getProductsByShop = async (shopId) => {
  const { data } = await api.get(`/shops/${shopId}/products`);
  return data;
};

/** Create product */
export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data;
};

/** Update product */
export const updateProduct = async (productId, payload) => {
  const { data } = await api.put(`/products/${productId}`, payload);
  return data;
};

/** Delete product */
export const deleteProduct = async (productId) => {
  await api.delete(`/products/${productId}`);
};

/** Get global product categories (for dropdown when adding product) */
export const getProductCategories = async () => {
  //const { data } = await api.get("/product-categories");
  //return data;
  return getMockCategories();
};
