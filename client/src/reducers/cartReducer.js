export const initialCartState = {
  products: [],
  total: 0
}

function getCartTotal(products) {
  const total= products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
   console.log(total.toFixed(4))
   return total.toFixed(3)
}
function checkExist(arr,id){
  return arr.findIndex(p=>p.id===id)
}

export default function cartReducer(state, action) {
  let newProducts
  
  switch(action.type) {
    case "RESET":
      return initialCartState

    case "SET_PRODUCTS":
      return {
        ...state, 
        products: action.payload,
        total: getCartTotal(action.payload),
      }

    case "ADD_PRODUCTS":
      console.log(action.payload[0])
      const index=checkExist([...state.products],action.payload[0].id)
      if(index<0){
        newProducts = [
          ...state.products, 
          ...action.payload.map(product => ({
            id: product.id,         
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: product.quantity,
          })),
        ]
      }
      else{
        newProducts=[...state.products,newProducts[index].quantity+=1]
      }

      return {
        ...state,
        products: newProducts,
        total: getCartTotal(newProducts)
      }

    case "REMOVE_PRODUCT":
      newProducts = state.products.filter(p => p.id !== action.payload)

      return {
        ...state, 
        products: newProducts,
        total: getCartTotal(newProducts),
      }

    case "SET_PRODUCT_QUANTITY":
      if (action.payload.quantity < 1) {
        return state
      }
      newProducts = [...state.products]
      const productIdx = newProducts.findIndex(p => p.id === action.payload.id)
      newProducts[productIdx].quantity = action.payload.quantity

      return {
        ...state,
        products: newProducts,
        total: getCartTotal(newProducts),
      }

    default:
      return state
  }
}