import './product.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../components/container';

import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../services/firebaseConnection';
import { doc, getDoc } from 'firebase/firestore';
import { FaCartPlus } from 'react-icons/fa6';
import { CartContext } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

interface ProductProps {
    id: string;
    uid: string;
    name: string;
    price: string | number;
    model: string;
    whatsapp: string;
    city: string;
    year: string;
    description: string;
    created: string;
    owner: string;
    images: ImageProductsProps[];
}

interface ImageProductsProps {
    name: string;
    uid: string;
    url: string;
}

export function Product() {
    const [product, setProduct] = useState({} as ProductProps);
    const [slider, setSlider] = useState<number>(2);
    const {id} = useParams();
    const {addItemCart} = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function LoadProduct() {
            if (!id) {
                return
                alert('Ops! Invalid!');
            }

            const docRef = doc(db, 'products', id);
            getDoc(docRef)
            .then((snapshot) => {
                if (!snapshot.data()) {
                    navigate('/error', {replace: true});
                }

                setProduct({
                    id: snapshot.id,
                    uid: snapshot.data()?.uid,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    whatsapp: snapshot.data()?.whatsapp,
                    city: snapshot.data()?.city,
                    year: snapshot.data()?.year,
                    price: snapshot.data()?.price,
                    description: snapshot.data()?.description,
                    created: snapshot.data()?.created,
                    owner: snapshot.data()?.onwer,
                    images: snapshot.data()?.images
                })
            })
            .catch((err) => {
                console.error(err);
                console.log('[ERROR] Contact the Developer :/')
            })
        }

        LoadProduct();
    }, [id]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 970) {
                setSlider(1);
            } else if (window.innerWidth > 970 && product.images.length <= 1) {
                setSlider(1);
            } else {
                setSlider(2);
            }
        }
        
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    function handleAddCart(product: ProductProps) {
        toast.success('Added to cart :)')
        addItemCart(product);
        navigate('/cart', {replace: true});
    }
    

    return (
        <Container>

            {product && product.images && (
                <Swiper 
                slidesPerView={slider}
                pagination={{clickable: true}}
                navigation
                >
                    {product?.images.map(image => (
                        <SwiperSlide key={image.name}>
                            <img src={image.url} alt={image.name} className='product-swiper-slide' />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {product && (
                <main className='product-main'>
                    <div className='product-main-2-h2-area'>
                        <h2>{product?.name}</h2>
                        <h2>R$ {product?.price}</h2>
                    </div>

                    <p>{product?.model}</p>

                    <button className='product-cart'
                    onClick={() => handleAddCart(product)}
                    >
                        Adicionar no carrinho? <FaCartPlus />
                    </button>

                    <div className='product-city-year'>
                        <div className="product-city-year-inside-container">
                            <div>
                                <p>Cidade</p>
                                <strong>{product?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{product?.year}</strong>
                            </div>
                        </div>
                    </div>

                    <strong>Description</strong>
                    <p className='product-description'>{product?.description}</p>

                    <strong>
                        Telefone / Whatsapp
                    </strong>
                    <p>{product?.whatsapp}</p>

                    <a href={`https://api.whatsapp.com/send/?phone=55${product?.whatsapp}&text=Olá! Vi esse ${product?.name} ${product?.model} e fiquei interessado!&type=phone_number&app_absent=0`} className='product-whatsapp' target='_blank'>Conversar com o vendedor</a>
                </main>
            )}
        </Container>
    )
}