import './home.css';
import { Container } from '../../components/container';
import { FaCartPlus } from "react-icons/fa";
import { AuthContext } from '../../contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { Footer } from '../../components/footer';
import toast from 'react-hot-toast';
import { Loader } from '../../components/loader';

export interface ProductProps {
    id: string;
    uid: string;
    name: string;
    price: string | number;
    city: string;
    year: string;
    images: ImageProductsProps[];
}

interface ImageProductsProps {
    name: string;
    uid: string;
    url: string;
}

export function Home() {
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [loadImages, setLoadImages] = useState<string[]>([]);
    const [inputSearch, setInputSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const {loadingAuth, signed} = useContext(AuthContext);
    const {addItemCart} = useContext(CartContext);

    useEffect(() => {
        loadProducts();
        window.addEventListener('load', loadProducts)

        return () => {
            window.removeEventListener('load', loadProducts);
        }
    }, []);

    function loadProducts() {
        const productsRef = collection(db, 'products')
        const queryRef = query(productsRef, orderBy('created', 'desc'))

        getDocs(queryRef)
        .then((snapshot) => {
            const listProducts = [] as ProductProps[];
            snapshot.forEach((item) => {
                listProducts.push({
                    id: item.id,
                    name: item.data().name,
                    price: item.data().price,
                    city: item.data().city,
                    uid: item.data().uid,
                    year: item.data().year,
                    images: item.data().images
                })
            })

            setProducts(listProducts);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            console.log('[ERRO] Contact the Developer!');
            setLoading(false);
        })
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
    }

    async function handleBuscarProduto() {
        if (inputSearch === '') {
            loadProducts();
            return;
        }

        setProducts([]);
        setLoadImages([]);

        const q = query(collection(db, 'products'), 
        where('name', '>=', inputSearch.toUpperCase()),
        where('name', '<=', inputSearch.toUpperCase() + '\uf8ff')

    )
        const querySnapshot = await getDocs(q);
        let listProducts = [] as ProductProps[];
        
        querySnapshot.forEach(doc => {
            listProducts.push({
                id: doc.id,
                name: doc.data().name,
                year: doc.data().year,
                uid: doc.data().uid,
                price: doc.data().price,
                city: doc.data().city,
                images: doc.data().images,
            })
        })

        setProducts(listProducts);
    }

    function handleAddCart(newItem: ProductProps) {
        if (!signed && !loadingAuth) {
            toast.error('Not logged in!')
            return;
        }

        toast.success('Added to cart :)');
        addItemCart(newItem);
    }

    if (loading) {
        return (
            <Loader />
        )
    }

    return (
        <div>
            <Container>
                <section className="home-section-bg">
                    <h2>Best new and used peripherals!</h2>
                </section>
                <section className='home-section-input'>
                    <input
                    type="text"
                    placeholder='Type a peripheral'
                    value={inputSearch}
                    onChange={(e) => setInputSearch(e.target.value)}
                    />
                    <button
                    onClick={handleBuscarProduto}
                    >
                        Search
                    </button>
                </section>
                <main className='home-main'>
                    {products.map((item) => (
            
                            <section className='home-product' key={item.id}>
                                <div
                                className='home-product-img-load'
                                style={{display: loadImages.includes(item.id) ? 'none' : 'block'}}
                                ></div>
                                <Link to={`/product/${item.id}`} className='home-product-link-container'>
                                    <img src={item.images[0].url} alt={item.name} onLoad={() => handleImageLoad(item.id)} />
                                    <p>{item.name}</p>
                                </Link>
            
                                <div className="home-product-content">
                                    <span className='home-product-content-span-year'>
                                        Year: {item.year}
                                    </span>
                                    <strong>
                                        <span>R$ {item.price}</span>
                                        <div className='home-product-container-strong-cart'>
                                            <button
                                            onClick={() => handleAddCart(item)}
                                            >
                                                <FaCartPlus size={22} color='fff' />
                                            </button>
                                        </div>
                                    </strong>
                                </div>
                                <div className="home-product-bar"></div>
            
                                <div className="home-product-cidade">
                                    <span>{item.city}</span>
                                </div>
                            </section>
                    ))}
                </main>
            </Container>
            <Footer />
        </div>
        
    )
}