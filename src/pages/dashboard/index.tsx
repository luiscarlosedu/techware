import { useContext, useEffect, useState } from 'react';
import './dashboard.css';

import { FiTrash2 } from 'react-icons/fi';

import { Container } from '../../components/container';
import { Painel } from '../../components/painel';

import { AuthContext } from '../../contexts/AuthContext';

import { db, storage } from '../../services/firebaseConnection';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

import { Link } from 'react-router-dom';

interface ProductProps {
    id: string;
    name: string;
    year: string;
    uid: string;
    price: number | string;
    city: string;
    images: ImageProductProps[];
}

interface ImageProductProps {
    name: string;
    uid: string;
    url: string;
}


export function Dashboard() {
    const [products, setProducts] = useState<ProductProps[]>([]);

    const {user} = useContext(AuthContext);

    useEffect(() => {
        function LoadProducts() {
            if (!user?.uid) {
                return;
            }

            const productsRef = collection(db, 'products');
            const queryProductsRef = query(productsRef, where('uid', '==', user.uid));

            getDocs(queryProductsRef)
            .then((snapshot) => {
                let listProducts = [] as ProductProps[];
                snapshot.forEach(item => {
                    listProducts.push({
                        id: item.id,
                        name: item.data().name,
                        price: item.data().price,
                        city: item.data().city,
                        uid: item.data().uid,
                        year: item.data().year,
                        images: item.data().images
                    })
                });

                setProducts(listProducts);
            })
            .catch((err) => {
                console.log('[ERROR] Contact the developer!');
                console.error(err);
            })
        }

        LoadProducts();
    }, [user]);

    async function handleDeleteProduct(item: ProductProps) {
        const itemProduct = item;
        const docRef = doc(db, 'products', itemProduct.id);

        await deleteDoc(docRef);
        
        itemProduct.images.map(async (img) => {
            const imagePath = `images/${img.uid}/${img.name}`
            const imageRef = ref(storage, imagePath)
            try {
                await deleteObject(imageRef);
                setProducts(products.filter(item => item.id !== itemProduct.id));
            } catch (err) {
                console.error(err);
                console.log('[ERRO] Contact the Developer!');
            }
        })
    }

    return (
        <Container>
            <Painel />
            
            <h2 className='dashboard-h2'>My Products</h2>

            {products.length === 0 && (
                <h3 className='dashboard-ops'>Oops! Apparently you have no registered products! <br /> <Link className='dashboard-ops-link' to='/dashboard/new'>Do you want to register?</Link></h3>
            )}

            <main className='dashboard-main'>
                {products.map((item) => (
                    <section className='dashboard-main-product' key={item.id}>

                    <button 
                    className="dashboard-main-product-trash"
                    onClick={() => handleDeleteProduct(item)}
                    >
                        <FiTrash2 size={25} color='#000' />
                    </button>

                    <img src={item.images[0].url} alt={item.name} className='dashboard-main-product-img' />

                    <p>{item.name}</p>
                    
                    <div className="dashboard-main-product-content">
                        <span>
                            Year: {item.year}
                        </span>
                        <strong>
                            <span className='dashboard-main-product-content-strong'>R$ {item.price}</span> 
                        </strong>
                    </div>

                    <div className="dashboard-main-product-bar"></div>

                    <div className="dashboard-main-product-city">
                        <span>{item.city}</span>
                    </div>
                </section>
                ))}
            </main>
        </Container>
    )
}