import React, { useRef } from 'react'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'
import toast from 'react-hot-toast'
import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import Link from 'next/link'
import getStripe from '../lib/getStripe'

const Cart = () => {
  const cartRef = useRef();
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove }  = useStateContext();
  const handleCheckout = async () => {
    const stripe = await getStripe()
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems)
    })
    if (response.statusCode === 500) return

    const data = await response.json()
    console.log(data)
    toast.loading('Redirecting...')
    stripe.redirectToCheckout({ sessionId: data.id })
  }
  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button className="cart-heading" type="button" onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({ totalQuantities }) items</span>
        </button>
        {
          cartItems.length < 1 && (
            <div className="empty-cart">
              <AiOutlineShopping size={150} />
              <h3>Your shopping bag is empty.</h3>
              <Link href="/">
                <button 
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
                >
                  Continue shopping
                </button>
              </Link>
            </div>
          )
        }
        <div className="product-container">
          {
            cartItems.length >= 1 && cartItems.map(cartItem => (
              <div key={ cartItem._id} className="product">
                <img src={ urlFor(cartItem?.image[0]) } alt="Cart Item" className="cart-product-image"/>
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{ cartItem.name }</h5>
                    <h4>${ cartItem.price }</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span className="minus" onClick={() => toggleCartItemQuantity(cartItem._id, "dec")}>
                                <AiOutlineMinus />
                            </span>
                            <span className="num">
                               { cartItem.quantity }
                            </span>
                            <span className="plus" onClick={() => toggleCartItemQuantity(cartItem._id, "inc")}>
                              <AiOutlinePlus />
                          </span>
                      </p>
                    </div>
                    <button className="remove-item"
                    type="button"
                    onClick={() => onRemove(cartItem)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal</h3>
              <h3>${ totalPrice }</h3>
            </div>
            <div className="button-container">
              <button className="btn"
              type="button"
              onClick={handleCheckout}
              >
                Pay With Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart