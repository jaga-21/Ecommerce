import React, { useContext } from "react";
import { sliderItems } from "@/dummydata";

import { UserContext, CartContext } from "@/App";
import LoginForm from "@/ui/LoginForm";
import api from "@/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { cart } = useContext(CartContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fillProducts = () => {
    const arr = cart.products.map((p) => ({
      productID: p.id,
      quantity: p.quantity,
    }));
    return arr;
  };
  function getCookie(cookieName) {
    const cookiesArray = document.cookie.split("; ");
    for (var i = 0; i < cookiesArray.length; i++) {
      var cookie = cookiesArray[i];
      var parts = cookie.split('=');
      var name = decodeURIComponent(parts[0]);
      var value = decodeURIComponent(parts[1]);
      
      // Check if this is the cookie you want by comparing the name
      if (name === cookieName) {
        // Access the value of the cookie
        console.log('Value of yourCookieName:', value);

        break; // Exit the loop since you found the cookie
      }
    }
  }
  const handleLogin = async (userData) => {
    const resp = await api.loginUser(userData);
    console.log(resp.status);
    console.log(resp.data);
    const id = resp.data.user.id;
    console.log(id);
    if (resp.status == 200) {
      if (cart.products.length) {
        // await api.addProductsToCart(fillProducts());
        // console.log("response from server :" + response.message)
        const serverCart = cart.products.map((p) =>
          JSON.stringify({ productID: p.id, quantity: p.quantity })
        );
        await api.addAllProducts(serverCart);
        navigate("/cart");
      }

      const authToken = getCookie("auth_token");

      if (authToken) {
        // You now have the authentication token, and you can use it for making authenticated requests or other purposes.
        console.log("Authentication token:", authToken);
        setUser(resp.user)
      } else {
        // Handle the case where the token is not present (user not authenticated)
        console.log("User not authenticated");
      }

      if (cart.products.length) {
        navigate("/cart");
      } else {
        navigate("/account");
      }
    }
    return resp;
  };
  const randomSlide =
    sliderItems[Math.floor(Math.random() * sliderItems.length)];

  return (
    <main
      className="flex justify-center h-screen items-center bg-cover bg-center sm:bg-left"
      style={{ backgroundImage: `url(${randomSlide.image})` }}
    >
      <div className="min-w-sm p-6 rounded-lg bg-white filter drop-shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6">
          Login to your account
        </h3>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </main>
  );
}
