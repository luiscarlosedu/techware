import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/AuthContext';

import { Link } from 'react-router-dom';

import { IoIosCart } from "react-icons/io";
import { GrLogin } from "react-icons/gr";
import { FiUser } from 'react-icons/fi';
import { Logo } from '../logo';

import { CartContext } from '../../contexts/CartContext';

export function Header() {

    const { signed, loadingAuth } = useContext(AuthContext);
    const {cartAmount} = useContext(CartContext);

    return (
        <div className='header-container'>
            <header>
                <h1 className='logo-container'>
                    <Logo />
                </h1>

                <nav>
                    {signed && !loadingAuth && (
                        <Link 
                        to='/cart'
                        className="header-cart"
                        >
                            <IoIosCart size={28} color='white' />
                                {cartAmount > 0 && (
                                    <span className='header-cart-amount'>
                                    {cartAmount && (
                                        cartAmount
                                    )}
                                    </span>
                                )}
                        </Link>
                    )}

                    {!loadingAuth && signed && (
                        <Link to='/dashboard' className='header-login'>
                            <FiUser size={22}/>
                        </Link>
                    )}

                    {!loadingAuth && !signed && (
                        <Link to='/login' className='header-login'>
                            <GrLogin size={22}/>
                        </Link>
                    )}

                </nav>
            </header>
        </div>
    )
}