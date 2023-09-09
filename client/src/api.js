const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
const axiosObject = axios.create({
  baseURL: API_URL,
 
});

function setAccessToken(token) {
  localStorage.setItem("token", token);
}
function getAccessToken() {
  return localStorage.getItem("token");
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
async function getUser(id) {
  const user = await axiosObject
    .get(`/users/${id}`)
    .then((res) => res)
    .catch((e) => e);
  return user ? user : null;
}

async function registerUser(userdata) {
  const response = await axiosObject
    .post("/users/register", userdata)
    .then(err, (result) => {
      if (err) throw err;
      return result;
    });
  return response;
}

async function loginUser({ email, password }) {
  const response = await axiosObject
    .post("/users/login", { email, password })
    .then((result) => {
      return result;
    })
    .catch((e) => e);

  if (response.accessToken) {
    setAccessToken(data.accessToken);
    await fetchUserDetails();
  }
  return response;
}

function logoutUser() {
  localStorage.clear();
}

async function createUserCart(products) {
  const resp = await axiosObject
    .post("cart/create", products)
    .then((result) => result)
    .catch((e) => e);
  return res;
  // const resp = await fetch(API_URL + "/carts", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "x-access-token": getAccessToken(),
  //   },
  //   body: JSON.stringify(products.length ? { products } : {}),
  // });
  // return await resp.json();
}

async function getUserCart() {
  const response = await axiosObject
    .get("/cart/")
    .then((res) => res)
    .catch((e) => e);

  // const resp = await fetch(API_URL + "/carts/" + userID, {
  //   headers: {
  //     "x-access-token": getAccessToken(),
  //   },
  // });

  const cart = await resp.json();
  if (cart.products) {
    cart.products = cart.products.map((product) => ({
      id: product.productID._id,
      title: product.productID.title,
      price: product.productID.price,
      image: product.productID.image,
      quantity: product.quantity,
    }));
  }
  return cart;
}

async function addProductsToCart(productID, quantity ) {
  const response = await axiosObject
    .post(`/cart/add/${productID}`, { quantity: quantity })
    .then((result) => result)
    .catch((e) => e);
  return response;
}
async function addAllProducts(products) {
  const response = await axiosObject
    .post("/cart/addAll", { products: products })
    .then((res) => res)
    .catch((e) => e);
}

async function removeProductFromCart(productID) {
  return patchCart(productID, 0);
}

async function patchCart(productID, quantity) {
  const response = await axiosObject
    .patch(`/cart/patch/${productID}`, { quantity })
    .then((result) => result)
    .catch((e) => e);
  return response;
}

async function clearCart() {
  const resp = await fetch(API_URL + "/carts/clear", {
    method: "POST",
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchUserDetails() {

  const userfromresponse = await axiosObject
    .get("users/:id")
    .then((result) => result)
    .catch((e) => e);
  if (userfromresponse.status == 200) {
    setUser(userfromresponse);
  }
  // return {status,user}
  return user;
}

async function fetchProducts(category, newArrivals = false) {
  // let query = `new=${newArrivals ? "true" : "false"}${
  //   category ? "&category=" + category : ""
  // }`;
  console.log("calling api");
  const resp = await axiosObject.get("/products", (err, result) => {
    if (err) {
      throw err;
    } else {
      return JSON.parse(result);
    }
  });
  console.log(resp);
  return resp.data;
}



async function fetchProduct(id) {
  const resp = await axiosObject.get(`products/${id}`, (err, result) => {
    if (err) {
      throw err;
    } else {
      return result;
    }
  });
  console.log(resp.data);
  return resp.data;
}

async function proceedCheckout() {
  const resp = await fetch(API_URL + "/checkout/payment", {
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

// on production create the order using stripe webhooks
async function createOrder(products, amount, address) {
  const resp = await fetch(API_URL + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({
      products: products.map((p) => ({
        productID: p.id,
        quantity: p.quantity,
      })),
      amount,
      address,
    }),
  });
  return await resp.json();
}

async function fetchAllOrders() {
  const userID = getUser()._id;
  const resp = await fetch(API_URL + "/orders/user/" + userID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchOrderDetails(orderID) {
  const resp = await fetch(API_URL + "/orders/" + orderID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchComments(id){
  const resp = await axiosObject.get(`products/comments`, (err, result) => {
    if (err) {
      throw err;
    } else {
      return result;
    }
  });
  return resp
}

async function postComment(id,obj){
  console.log("posting the comment")
  const resp = await axiosObject.post(`products/comments/${id}`,{comment:obj}, (err, result) => {
    if (err) {
      throw err;
    } else {
      return result;
    }
  });
  return resp.data
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  fetchUserDetails,
  fetchProducts,
  fetchProduct,
  createUserCart,
  getUserCart,
  addProductsToCart,
  removeProductFromCart,
  patchCart,
  clearCart,
  fetchComments,
  postComment,
  proceedCheckout,
  createOrder,
  fetchAllOrders,
  fetchOrderDetails,
  axiosObject,
  addAllProducts
};
