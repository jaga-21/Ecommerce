import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ShoppingCart } from "react-feather";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import api from "../api";
import { CartContext, UserContext } from "@/App";
import ReviewComponent from "../components/ReviewComponent";
import CommenttForm from "../ui/CommenttForm";

export default function ProductDetailsPage() {
  const  user  = useContext(UserContext);
  const { cart, cartDispatch } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [existInCart, setExistInCart] = useState(false);
  const [comments, setComments] = useState([]);

  // add review system in this component
  const getProductDetails = async () => {
    const resp = await api.fetchProduct(id);
    if (resp.status == "error") {
      return history.replace("/404");
    }
    setProduct(resp);
  };
  function findExistInCart() {
    const ans = cart.products.some((p) => p.id === id);
    setExistInCart(true);
  }
  async function getallComments() {
    const resp = await api.fetchComments(id);
    if (resp) {
      console.log("printing out all the comments ");
      console.log(resp.data);
      setComments(resp.data);
    } else {
      console.log("error occured while retreiving comments ");
    }
  }
  useEffect(() => {
    getProductDetails();
    findExistInCart();
    getallComments();
  }, [id]);

  const addToCart = async (e, quantity = 1) => {
    if (user) {
      const resp = await api.addProductsToCart([{ productID: id, quantity }]);
      if (resp.status === "ok") {
        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: [{ product: product, quantity: quantity }],
        });
      }
    } else {
      cartDispatch({
        type: "ADD_PRODUCTS",
        payload: [{ product: product, quantity: quantity }],
      });
    }
  };

  if (!product) return <Loader />;

  return (
    <main className="relative mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 py-8 px-4">
        <section className="flex items-center max-h-2xl overflow-hidden my-10 sm:mx-0">
          <img className="object-cover" src={product.image} />
        </section>
        <section className="flex flex-col justify-center space-y-6 text-gray-600">
          <h2 className="text-4xl text-gray-800">{product.title}</h2>
          <p className="text-xl">{product.description}</p>
          <span className="text-2xl font-medium">${product.price}</span>
          {existInCart ? (
            <Link to="/cart">
              <Button link className="sm:max-w-xs text-base">
                <Check className="mr-2" />
                <span>Added to Cart</span>
              </Button>
            </Link>
          ) : (
            <Button className="sm:max-w-xs text-base" onClick={addToCart}>
              <ShoppingCart className="opacity-80 mr-4" />
              <span>Add to Cart</span>
            </Button>
          )}
        </section>
      </div>
      <div className="h-[1px] bg-gray-300 my-4">
      </div>
      <section className="my-2">
        <CommenttForm id={id} />
      </section>
      {comments.length > 0 ? (
        comments.map((p) => {
          return (
            <ReviewComponent
              key={p.id}
              name="suresh"
              comment={p.comment_text}
              rating={p.rating}
            />
          );
        })
      ) : (
        <div>no comments to show</div>
      )}
      <Button
        onClick={() => navigate(-1)}
        className="absolute top-0 text-lg"
        secondary
      >
        <ChevronLeft className="mr-2" /> Back
      </Button>
    </main>
  );
}
