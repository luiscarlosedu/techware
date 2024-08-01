import './cart.css';
import { Container } from '../../components/container';
import Modal from '../../components/modal';
import { useContext } from 'react';
import { CupomContext } from '../../contexts/CupomContext';
import { CartContext } from '../../contexts/CartContext';

import { TbShoppingCartQuestion } from "react-icons/tb";
import { Link } from 'react-router-dom';

export function Cart() {

    const { cupomInput } = useContext(CupomContext);
    const { cart, total, cartAmount } = useContext(CartContext);
    const totalCart = Number(total.replace(/[^0-9,-]+/g,"").replace(",","."));
    const desconto = 30;

    const { addItemCart, removeItemCart } = useContext(CartContext);

    const totalComDesconto = (totalCart - (totalCart * desconto / 100)).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return (
        <Container>
            <div className='cart-page active-cupom'>
                <div className="cart-content">
                    {cart.length === 0 ? (
                        <h2>Your shopping cart is empty!</h2>
                    ) : (
                        <h2>You have {cart.length} {cart.length === 1 ? "item" : "items"}!</h2>
                    )}

                    {cartAmount ? (
                        <div className='cart-product-scroll'>
                        {cart.map((item) => (
                            <section className='cart-product' key={item.id}>
                                <div className='cart-product-left'>
                                    <img src={item.images[0].url} alt={item.name} />
                                </div>
                                <div className="cart-product-right">
                                    <p>{item.name}</p>
                                    <div className="cart-product-right-strong-total">
                                        <strong>R$ {item.price}</strong>
                                        <div className='cart-product-right-total'>
                                            <button className='cart-product-right-total-no-active-btn'
                                                onClick={() => removeItemCart(item)}
                                            >-</button>
                                            {item.amount}
                                            <button className='cart-product-right-total-active-btn'
                                                onClick={() => addItemCart(item)}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                    ) : (
                        <div className='cart-product-scroll cart-amount-zero'>
                            <div className="cart-amount-zero-content">
                                <TbShoppingCartQuestion size={120} />
                                <Link to='/'>Add product</Link>
                            </div>
                        </div>
                    )}

                    <div className={total ? 'cart-content-total' : 'cart-content-total without'}>
                        <div className='cart-content-total-price'>
                            <span>Total:</span>
                            {
                                cupomInput ? (
                                    <strong>{totalComDesconto}</strong>
                                ) : (
                                    <strong>{total ? total : 'R$ 0,00'}</strong>
                                )
                            }
                        </div>

                        {total && (
                            <Modal cupom='luiscarlosedu' />
                        )}

                        {total && (
                            <button className='cart-content-total-btn'>
                                Complete purchase
                            </button>   
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}
