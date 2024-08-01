import './input.css';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    errors?: string;
    rules?: RegisterOptions
}

export function Input({name, placeholder, type, register, errors, rules}: InputProps) {
    return (
        <div>
            <input 
            required
            className='input-component'
            placeholder={placeholder}
            type={type}
            {...register(name, rules)}
            id={name}
            />
            {errors && <p className='input-component-errors'>{errors}</p>}
        </div>
    )
}