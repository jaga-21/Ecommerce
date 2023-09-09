import React, { useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";
import { useLocation } from "react-router-dom";

import ProductList from "@/ui/ProductList";
import Container from "@/components/Container";
import Button from "@/components/Button";
import DropDown, { Select, Option } from "@/components/DropDown";
import useClickOutside from "@/hooks/useClickOutside";
import api from "../api";
import { CartContext, UserContext } from "@/App";

const sortOptions = [
  "popular",
  "new",
  "price: low to high",
  "price: high to low",
];

export default function ProductsPage() {
  const { cartDispatch } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dropDownRef = useClickOutside(() => setShowSortOptions(false));
  const [category, setCategory] = useState(useLocation().state?.category || "");

  const getProducts = async () => {
    try {
      const result = await api.fetchProducts(category);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    } 
  };
  
  useEffect(() => {
    let isMounted = true; // To prevent state updates when the component is unmounted
    const fetchData = async () => {
      const result = await getProducts();
  
      if (isMounted) {
        setProducts(result);
  
        if (category) {
          const newProducts = result.filter((p) => p.category === category);
          setProducts(newProducts);
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false; // Clean up to avoid state updates on unmounted components
    };
  }, [category]);

  useEffect(() => sortProducts(sort), [sort]);

  const sortProducts = (sortType) => {
    switch (sortType) {
      case 1:
        setProducts([...products].sort((a, b) => a.updatedAt - b.updatedAt));
      case 2:
        setProducts([...products].sort((a, b) => a.price - b.price));
        break;
      case 3:
        setProducts([...products].sort((a, b) => b.price - a.price));
        break;

      default:
        return;
    }
  };

  const addToCart = async (product, quantity = 1) => {
    console.log("product page accessed");
    console.log(user);
    if (user) {
      const productId = product.id;
      console.log("productId =>" + productId);
      const resp = await api.addProductsToCart(productId, quantity);
      if (resp.status === 200) {
        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: [{ ...product, quantity }],
        });
      }
    } else {
      cartDispatch({
        type: "ADD_PRODUCTS",
        payload: [{ ...product, quantity }],
      });
    }
  };

  return (
    <main>
      <Container
        heading={`Products${category ? " for: " + category : ""}`}
        type="page"
      >
        <section className="flex justify-end">
          <div className="relative" ref={dropDownRef}>
            <span className="font-bold">Sort by:</span>
            <Button
              secondary
              onClick={() => setShowSortOptions((prev) => !prev)}
            >
              {sortOptions[sort]} <ChevronDown className="ml-2" />
            </Button>

            {showSortOptions && (
              <DropDown
                className="mt-10 inset-x-0"
                onClick={() => setShowSortOptions(false)}
              >
                <Select>
                  {sortOptions.map((option, i) => (
                    <Option key={option} onClick={() => setSort(i)}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </DropDown>
            )}
          </div>
        </section>
        <ProductList products={products} onAddToCart={addToCart} />
      </Container>
    </main>
  );
}
