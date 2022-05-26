import React from 'react'
import { AiOutlineShopping } from 'react-icons/ai'
import Link from 'next/link'
import Cart from './Cart'
import { useStateContext } from '../context/StateContext'

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext()
  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">
          Audio & Accessories PLC
        </Link>
      </p>
      <button type="submit" className="cart-icon" onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{ totalQuantities }</span>
      </button>
      { showCart && <Cart /> }
    </div>
  )
}

export default Navbar