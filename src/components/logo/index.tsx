import { FaComputer } from "react-icons/fa6";
import { Link } from "react-router-dom";

export function Logo() {
    return (
        <div className="logo-container">
            <Link to='/' className='logo'>
                Tec<span>Ware</span>
            </Link>
            <FaComputer className='logo-icon' />
        </div>
    )
}