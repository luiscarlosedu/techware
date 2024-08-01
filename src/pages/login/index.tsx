import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import './login.css';
import { FaComputer } from 'react-icons/fa6';

import {useForm} from 'react-hook-form'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {auth} from '../../services/firebaseConnection';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { CartContext } from '../../contexts/CartContext';
import toast from 'react-hot-toast';

const schema = z.object({
    email: z.string().email("Email is invalid or already taken").min(1, 'This field is required'),
    password: z.string().min(6, 'Enter at least 6 digits')
})

type FormData = z.infer<typeof schema>

export function Login() {
    const {setCartZero} = useContext(CartContext);
    const navigate = useNavigate();

    const {register, handleSubmit, formState: {errors} } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    useEffect(() => {
        async function handleLogOut() {
            await signOut(auth);
        }

        handleLogOut();
    }, []);

    useEffect(() => {
        setCartZero();
    }, [auth]);

    function onSubmit(data: FormData) {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            console.log('SUCESS')
            navigate('/dashboard', {replace: true});
        })
        .catch((error) => {
            console.error(error);
            console.log('[ERRO] Não foi possível fazer o login do usuário!');
            toast.error('[ERROR] Invalid email or password! Try again :)')
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
                        placeholder='Email'
                        type='email'
                        name='email'
                        errors={errors.email?.message}
                        register={register}
                        />
                    </div>

                    <div className='login-main-form-input-container'>
                        <Input
                        placeholder='Password'
                        type='password'
                        name='password'
                        errors={errors.password?.message}
                        register={register}
                        />
                    </div>


                    <button
                    className='login-main-form-btn'
                    >
                        Acess
                    </button>
                </form>

                <div className="login-main-signup">
                    <p>New to TechWare? <Link className='login-main-signup-link' to='/register'>Sign up</Link></p>
                </div>

            </main>
        </Container>
    )
}