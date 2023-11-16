import { auth, provider } from '../firebase-config.js';
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie';
import '../App.css'
import Logo from '../Untitled design.png'

const cookies = new Cookies()

export const Auth = (props) => {
    const  { setIsAuth } = props;

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result);
            cookies.set("auth-token", result.user.refreshToken);
            setIsAuth(true);
        } catch(err) {
            console.error(err);
        }
    };

    return <div className="auth">
        <div className='auht-in'>
        <img src={Logo} alt=''/>
        <button className='auth-btn' onClick={signInWithGoogle}> Login</button>
        </div>
    </div>
};