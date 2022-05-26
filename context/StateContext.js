import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1)

    let foundProduct;
    let index;

    const increaseQty = () => (setQty((prevQty) => prevQty + 1));
    const decreaseQty = () => (setQty((prevQty) => {
        if (prevQty - 1 < 1) return 1
        return prevQty - 1
    }))
    const onAdd = (product, quantity) => {
        const isProductInCart = cartItems.find(item => item._id === product._id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity)

        setTotalQuantities((prevTotalQuantity) => prevTotalQuantity + quantity)

        if (isProductInCart){
            const updatedCartItems = cartItems.map((cartItem) => {
                if (cartItem._id === product._id){
                    return {
                        ...cartItem,
                        quantity: cartItem.quantity + quantity
                    }
                }
            })
            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            setCartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }
    const onRemove = (product) => {
        const foundProduct = cartItems.find(cartItem => cartItem._id === product._id)
        const newCartItems = cartItems.filter(cartItem => cartItem._id !== foundProduct._id)
        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.quantity * foundProduct.price)
        setTotalQuantities(prevTotalQuantity => prevTotalQuantity - foundProduct.quantity)
        setCartItems(newCartItems)
    }
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((cartItem) => cartItem._id === id)
        index = cartItems.findIndex(cartItem => cartItem._id === id)
        const newCartItems = cartItems.filter(item => item._id !== id)
        if (value === 'inc'){
            setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1}])
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities(previousTotalQuantties => previousTotalQuantties + 1)
        } else if(value === 'dec'){
            if (foundProduct.quantity > 1){
                setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1}])
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price)
                setTotalQuantities(previousTotalQuantties => previousTotalQuantties - 1)
            }
        }
    }

    
    return (
        <Context.Provider value={
            {
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                increaseQty,
                decreaseQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }
        }>
            { children }
        </Context.Provider>
    )
}
export const useStateContext = () => useContext(Context)