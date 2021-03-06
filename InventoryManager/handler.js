"use strict";
const request = require("request-promise");

async function getProductData(productId) {
  const options = {
    method: "GET",
    uri: `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products/${productId}`,
    headers: {
      accept: "application/json",
      "X-Auth-Client": process.env.BC_CLIENT,
      "X-Auth-Token": process.env.BC_TOKEN
    }
  };
  var productData = await request(options);
  return productData;
}

async function updateProductData(productId, availability) {
  // https://developer.bigcommerce.com/api-reference/store-management/catalog/products/updateproduct
  // Update product
  var productUpdate = {
    preorder_message: "Back Order",
    availability: availability
  };
  const options = {
    method: "PUT",
    uri: `https://api.bigcommerce.com/stores/${process.env.STORE_HASH}/v3/catalog/products/${productId}`,
    headers: {
      accept: "application/json",
      "X-Auth-Client": process.env.BC_CLIENT,
      "X-Auth-Token": process.env.BC_TOKEN
    },
    body: productUpdate,
    json: true
  };
  var productData = await request(options);
  return productData;
}

module.exports.inventoryManager = async event => {
  let inventoryData = JSON.parse(event.body);
  const [store, type, data] = inventoryData.scope.split("/");
  const productDataRaw = await getProductData(inventoryData.data.id);
  const productData = JSON.parse(productDataRaw);

  //TODO more logic around wanting to do back order for a product
  if (productData.data.inventory_level == 0) {
    console.log("make pre order");
    await updateProductData(inventoryData.data.id, "preorder");
  } else {
    await updateProductData(inventoryData.data.id, "available");
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    },
    body: JSON.stringify("product is new available for back order")
  };
};
