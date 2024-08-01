import './painel.css';
import { Container } from "../container";
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebaseConnection';
import { signOut } from 'firebase/auth';

export function Painel() {

    async function handleLogOut() {
        await signOut(auth);
    }

    return (
        <div className="painel-dashboard">
            <Link to='/dashboard'>
                Dashboard
            </Link>
            <Link to='/dashboard/new'>
                Register product
            </Link>
            <button
            onClick={handleLogOut}
            >
                Sign Out
            </button>
        </div>
    )
}