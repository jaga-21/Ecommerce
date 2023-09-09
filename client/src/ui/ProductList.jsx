import React, { useContext } from 'react'

import Product from "@/components/Product"
import { CartContext } from "@/App"

export default function ProductList({ products, onAddToCart }) {
  const {cart} = useContext(CartContext)

	return (
		<div className="flex flex-wrap justify-center">
			{products.map(product => (
				<Product
					key={product.id}
					imgSrc={product.image}
					price={product.price}
					link={`/products/${product.id}`}
					onAddToCart={() => onAddToCart(product)}
					isInCart={cart.products.some(p => p.id === product.id)}
				/>					
			))}
		</div>
	)
}