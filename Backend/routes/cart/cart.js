import express from "express";

const cartRouter = express.Router();
let cart = {
  userId:0,
  products: [],
  
};
let newProducts = [];
cartRouter.get("/", (req, res) => {
  return cart;
});

cartRouter.post("/add/:id", (req, res) => {
  console.log("params =>"+req.params.id)
  newProducts = [
    ...cart.products,
    { productId: parseInt(req.params.id), quantity: req.body.quantity },
  ];

  cart = {
    ...cart,
    products: newProducts,
    
  };
  console.log(cart);
  res.send("added");

});

cartRouter.post('/addAll',(req,res)=>{
  console.log("add all is called")
  const products=req.body.products
  // newProducts=[...cart.products].concat(...products)
  newProducts=products.map(p=>JSON.parse(p))
    cart={
    ...cart,
    products:newProducts,
    
  }
  res.send("addedAll")
})

cartRouter.patch("/patch/:id", (req, res) => {
  const quan = req.body;
  if (quan > 0) {
    const index= cart.products.findIndex((p) => p.id === parseInt(req.params.id));
    console.log(index)
    cart.products[index].quantity+=quan
    newProducts=[...cart.products]
  }
   else {
    newProducts = cart.products.filter((p) => p.id !== req.params.id);
  }
  // console.log(req.session);
  console.log(cart)
  cart={
    ...cart,
    products:newProducts
  }
});
function getTotal() {
  return cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
}

cartRouter.post("/create", (req, res) => {
  if (req.session.cart.length) {
    req.session.cart = [...req.session.cart, req.body];
    res.send("completed");
  }
  req.session.cart = products;
  return res.send("fully added");
});

cartRouter.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  // get the availability from admin database
  const availSize = 10;
  const cart = req.session.cart;
  cart = cart.filter((e) => e.id !== id);
  const count = req.session.cart.count;
  req.session.cart.count = --count;
  res.send({ message: "Deleted", cart: cart });
});
export default cartRouter;
