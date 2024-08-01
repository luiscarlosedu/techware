import { createContext, ReactNode, useState } from "react";
import { ProductProps } from "../pages/home";

interface CartContextData {
    cart: CartProps[];
    cartAmount: number;
    addItemCart: (newItem: ProductProps) => void;
    removeItemCart: (item: CartProps) => void;
    total: string;
    setCartZero: () => void;
}

export interface CartProps {
    id: string;
    uid: string;
    name: string;
    price: string | number;
    model?: string;
    whatsapp?: string;
    city: string;
    year: string;
    description?: string;
    created?: string;
    owner?: string;
    images: ImageProductsProps[];
    amount: number;
    total: string;
}

interface ImageProductsProps {
    name: string;
    uid: string;
    url: string;
}

interface CartProviderProps {
    children: ReactNode;
}

export const CartContext = createContext({} as CartContextData);

function CartProvider({children}: CartProviderProps) {
    const [cart, setCart] = useState<CartProps[]>([]);
    const [total, setTotal] = useState('');

    function addItemCart(newItem: ProductProps) {
        const indexItem = cart.findIndex(item => item.id === newItem.id);
    
        if (indexItem !== -1) {
            const cartList = [...cart];
            cartList[indexItem].amount++;
            cartList[indexItem].total = String(Number(cartList[indexItem].price) * cartList[indexItem].amount);
    
            setCart(cartList);
            handleTotalCart(cartList);
        } else {
            const data: CartProps = {
                ...newItem,
                amount: 1,
                total: String(newItem.price)
            };
    
            const cartList = [...cart, data];
            setCart(cartList);
            handleTotalCart(cartList);
        }
    }
    
    function removeItemCart(item: CartProps) {
        const indexItem = cart.findIndex(previusItem => previusItem.id === item.id);
    
        if (indexItem !== -1 && cart[indexItem]?.amount > 1) {
            const cartList = [...cart];
            cartList[indexItem].amount--;
            cartList[indexItem].total = String(Number(cartList[indexItem].total) - Number(cartList[indexItem].price));
    
            setCart(cartList);
            handleTotalCart(cartList);
        } else {
            const cartList = cart.filter(previusItem => previusItem.id !== item.id);
            setCart(cartList);
            handleTotalCart(cartList);
        }
    }
    
    function handleTotalCart(items: CartProps[]) {
        const result = items.reduce((acc, obj) => acc + Number(obj.total), 0);
        const resultFormated = result.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        setTotal(resultFormated);
    }

    function setCartZero() {
        setCart([]);
        setTotal('');
    }
    

    return (
        <CartContext.Provider value={{cart, cartAmount: cart.length, addItemCart, removeItemCart, total, setCartZero}}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;