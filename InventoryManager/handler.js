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
  console.log("error log 1", productData);

  return productData;
}

async function updateProductData(productId) {
  // https://developer.bigcommerce.com/api-reference/store-management/catalog/products/updateproduct
  // CREATE product
  var productUpdate = {
    preorder_message: "Back Order",
    availability: "preorder",
    inventory_tracking: "none"
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
  console.log("error log 1", productData);

  return productData;
}

module.exports.inventoryManager = async event => {
  let inventoryData = JSON.parse(event.body);
  const [store, type, data] = inventoryData.scope.split("/");
  console.log("data", data);
  const productDataRaw = await getProductData(inventoryData.data.id);
  const productData = JSON.parse(productDataRaw);
  if (productData.data.inventory_level == 0) {
    console.log("make pre order");
    await updateProductData(inventoryData.data.id);
  } else {
    console.log("Do not update product");
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
