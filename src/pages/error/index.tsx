import { Link } from 'react-router-dom';
import { Container } from '../../components/container';
import './error.css';

export function Error() {
    return (
        <Container>
            <main className='error-page'>
                <h1>404</h1>
                <h2>Página não encontrada :(</h2>
                <p>Pesquisamos alto e baixo, mas não conseguimos encontrar o que você está procurando. Vamos encontrar um lugar melhor para você ir</p>

                <Link className='error-page-link' to='/'>Home</Link>
            </main>
        </Container>
    )
}