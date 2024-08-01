import { FormEvent, useContext, useState } from "react";
import "./modal.css";
import { GoTag } from "react-icons/go";
import { BiX } from "react-icons/bi";
import { CupomContext } from "../../contexts/CupomContext";
import toast from "react-hot-toast";

interface ModalProps {
    cupom: string;
}

export default function Modal({cupom}: ModalProps) {
    const [modal, setModal] = useState(false);
    const [modalInput, setModalInput] = useState('');
    const [cupomVerificado, setCupomVerificado] = useState(false);

    const {setCupom, cupomInput} = useContext(CupomContext);

    const toggleModal = () => {
        setModal(!modal);
    };

    if(modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    function handleVerificarCupom(e: FormEvent) {
        e.preventDefault();
        if(cupom !== modalInput) {
            toast.error('Invalid coupon!')
            return;
        }
        setCupomVerificado(true);
        setCupom();
    }


    return (
        <>

        <p 
        onClick={toggleModal}
        className='cart-content-add-cupom'
        > <GoTag size={16} /> Would you like to add a coupon?</p>

        {modal && (
            <div className="modal">
            
            <div onClick={toggleModal} className="overlay"></div>
            
            <div className="modal-content">
                <h2>Add coupon</h2>
                <p className="modal-cupom"><span>{cupom}</span> | 30% off</p>
                <p>
                    Wow! It looks like it's your lucky day! We have a special coupon today!
                </p>

                <form onSubmit={handleVerificarCupom}>
                    <input
                    type="text"
                    className="modal-input"
                    value={modalInput}
                    onChange={(e) => setModalInput(e.target.value)}
                    placeholder="Enter your coupon"
                    />

                    <button type="submit" className="modal-form-btn">
                        Add
                    </button>

                    {cupomVerificado && (
                        <p className="modal-congratulations">Coupon added! Check it out!</p>
                    )}
                </form>


                <button className="close-modal" onClick={toggleModal}>
                <BiX size={22} />
                </button>

            </div>

            </div>
        )}
        </>
    )

    }