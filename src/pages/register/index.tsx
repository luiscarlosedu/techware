import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import './register.css';
import { FaComputer } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import {useForm} from 'react-hook-form'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { AuthContext } from '../../contexts/AuthContext';
import { auth } from '../../services/firebaseConnection';
import toast from 'react-hot-toast';
import { CartContext } from '../../contexts/CartContext';

const schema = z.object({
    nome: z.string().min(1, 'This field is required'),
    email: z.string().email("Email is invalid or already taken").min(1, 'This field is required'),
    password: z.string().min(6, 'Enter at least 6 digits')
})

type FormData = z.infer<typeof schema>

export function Register() {
    const navigate = useNavigate();
    const {handleInfoUser} = useContext(AuthContext);
    const {setCartZero} = useContext(CartContext);

    const {register, handleSubmit, formState: {errors} } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });
    
    useEffect(() => {
        setCartZero();
    }, [auth]);

    async function onSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
                displayName: data.nome
            })

            handleInfoUser({
                email: data.email,
                name: data.nome,
                uid: user.user.uid
            })

            toast.success('Cadastrado com sucesso!');
            console.log('Cadastrado com sucesso!')
            navigate('/dashboard', {replace: true});
        })
        .catch((err) => {
            console.error(err);
            console.log('[ERRO]');
        })
    }

    return (
        <Container>
                <main className='login-main'>
                    <div className='logo-container login-main-logo'>
                        <Link to='/' className='logo'>
                            Tec<span>Ware</span>
                        </Link>
                        <FaComputer className='logo-icon' />
                    </div>
                    <form
                    className='login-main-form'
                    onSubmit={handleSubmit(onSubmit)}
                    >
                
                        <div className='login-main-form-input-container'>
                            <Input
                            type='text'
                            placeholder='Digite seu nome'
                            name='nome'
                            errors={errors.nome?.message}
                            register={register}
                            />
                        </div>
                        <div className='login-main-form-input-container'>
                            <Input
                            type='Email'
                            placeholder='Digite seu email'
                            name='email'
                            errors={errors.email?.message}
                            register={register}
                            />
                        </div>
                        <div className='login-main-form-input-container'>
                            <Input
                            type='password'
                            placeholder='Digite sua senha'
                            name='password'
                            errors={errors.password?.message}
                            register={register}
                            />
                        </div>
                        <button
                        className='login-main-form-btn'
                        type='submit'
                        >
                            Acess
                        </button>
                    </form>

                    <div className="login-main-signup">
                        <p>Already have an account? <Link className='login-main-signup-link' to='/login'>Sign in</Link></p>
                    </div>
                </main>
        </Container>
    )
}
