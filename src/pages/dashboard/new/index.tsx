import { FiUpload } from 'react-icons/fi';
import { Container } from '../../../components/container';
import { Footer } from '../../../components/footer';
import { Painel } from '../../../components/painel';
import { Input } from '../../../components/input';
import './new.css';

import {useForm} from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useState } from 'react';

import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

import { v4 as uuidV4 } from 'uuid';

import { storage } from '../../../services/firebaseConnection';
import { ref, deleteObject, getDownloadURL, uploadBytes } from 'firebase/storage';

import { db } from '../../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa6';

import toast from 'react-hot-toast';

const schema = z.object({
    name: z.string().min(1, "Required field"),
    model: z.string().min(1, "Required field"),
    whatsapp: z.string().min(10, "Invalid phone number!").max(12),
    year: z.string().min(1, "Required field"),
    price: z.string().min(1, "Required field"),
    city: z.string().min(1, "Required field"),
    description: z.string().min(1, "Required field"),
})

type FormData = z.infer<typeof schema>

interface ImageItemProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function New() {
    const [itemImage, setItemImage] = useState<ImageItemProps[]>([]);


    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    });

    const {user} = useContext(AuthContext)

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image);
            } else {
                toast.error('Please send a JPEG or PNG image :/')
                return;
            }
        }
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return;
        }

        const currentUid = user?.uid;
        const imageUid = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${imageUid}`);

        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref)
            .then((downloadUrl) => {
                const imageItem = {
                    uid: currentUid,
                    name: imageUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl
                }

                setItemImage((images) => [...images, imageItem])
                toast.success('Imagem cadastrada!')
            })
            .catch((error) => {
                console.log('[ERROR]');
                console.error(error);
                toast.error('[ERROR]');
            })
        })
        .catch((error) => {
            console.log('[ERRO]')
            console.error(error);
            toast.error('[ERROR]')
        })

    }

    async function handleDelete(item: ImageItemProps) {
        const imagePath = `images/${item.uid}/${item.name}`;
        const imageRef = ref(storage, imagePath);
        try {
            await deleteObject(imageRef);
        } catch (err) {
            console.log('[ERROR]');
            console.error(err);
        }

        setItemImage(itemImage.filter((product) => product.uid !== item.uid));
    }

    function onSubmit(data: FormData) {
        if (itemImage.length === 0) {
            toast.error('Please send an image of this product!');
            return;
        }

        const itemListImages = itemImage.map((item) => {
            return {
                uid: item.uid,
                name: item.name,
                url: item.url,
            }
        });

        addDoc(collection(db, 'products'), {
            name: data.name.toUpperCase(),
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.year,
            price: data.price,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            id: uuidV4(),
            images: itemListImages
        })
        .then(() => {
            reset();
            setItemImage([]);
            console.log('Cadastrado com sucesso!')
            toast.success('registered successfully!')
        })
        .catch((error) => {
            console.log('[ERROR] Contact the developer @https.luisedu77 in instagram')
            console.error(error);
        })
    }

    return (
        <div>
            <Container>
                <Painel />
                <div className='new-file-field'>
                    <button className="new-file-btn">
                        <div className='new-file-btn-icon'>
                            <FiUpload className='new-file-btn-icon-children' size={ 30 } color='#FFF' />
                        </div>
                        <div className="new-file-btn-input">
                            <input
                            type="file"
                            accept='image/*'
                            onChange={handleFile}
                            />
                        </div>
                    </button>
                    {itemImage.map((item) => (
                        <div
                        key={item.uid}
                        className='new-file-item-image-container'
                        >
                            <button
                            className='new-file-item-image-delete'
                            onClick={() => handleDelete(item)}
                            >
                                <FaTrash />
                            </button>
                            <img
                            className='new-file-item-image'
                            src={item.previewUrl}
                            alt={item.name}
                            />
                        </div>
                    ))}
                </div>
                <div className="new-form-container">
                    <form className='new-form' onSubmit={handleSubmit(onSubmit)}>
                        <div className="new-form-label-input-container">
                            <label htmlFor="name" className='new-form-label'><p>Name</p></label>{/* */}
                            <Input
                            placeholder='Ex: Keyboard' ////
                            name='name'
                            register={register}
                            type='text'
                            errors={errors?.name?.message}
                            />
                        </div>
                        <div className="new-form-label-input-container">
                            <label htmlFor="model" className='new-form-label'><p>Model</p></label>{/* */}
                            <Input
                            placeholder='Ex: Mechanical Led Rgb AntiGhosting' ////
                            name='model'
                            register={register}
                            type='text'
                            errors={errors?.model?.message}
                            />
                        </div>
            
                        <div className='new-form-label-input-container-double'>
                            <div className="new-form-label-input-container double">
                                <label htmlFor="year" className='new-form-label'><p>Year</p></label>{/* */}
                                <Input
                                placeholder='Ex: 2023/2024' ////
                                name='year'
                                register={register}
                                type='text'
                                errors={errors?.year?.message}
                                />
                            </div>
                            <div className="new-form-label-input-container double">
                                <label htmlFor="price" className='new-form-label'><p>Price</p></label>{/* */}
                                <Input
                                placeholder='Ex: 65.70' ////
                                name='price'
                                register={register}
                                type='text'
                                errors={errors?.price?.message}
                                />
                            </div>
                        </div>
                        <div className="new-form-label-input-container-double">
                            <div className="new-form-label-input-container double">
                                <label htmlFor="city" className='new-form-label'><p>City</p></label>{/* */}
                                <Input
                                placeholder='Ex: São Paulo - SP - Brazil' ////
                                name='city'
                                register={register}
                                type='text'
                                errors={errors?.city?.message}
                                />
                            </div>
            
            
                            <div className="new-form-label-input-container double">
                                <label htmlFor="whatsapp" className='new-form-label'><p>Phone Number</p></label>{/* */}
                                <Input
                                placeholder='Ex: 099999999999' ////
                                name='whatsapp'
                                register={register}
                                type='text'
                                errors={errors?.whatsapp?.message}
                                />
                            </div>
                        </div>
                        <div className="new-form-label-input-container">
                            <label htmlFor="description" className='new-form-label'><p>Description</p></label>{/* */}
                            <textarea
                            className='new-form-text-area'
                            {...register('description')}
                            name='description'
                            id='description'
                            placeholder='Enter the full product description'
                            />
                            {errors.description && <p className='new-form-text-area-error'>{errors?.description?.message}</p>}
            
                        </div>
            
                        <button
                        className='new-form-btn'
                        type='submit'
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </Container>
            <Footer />
        </div>
    )
    
}