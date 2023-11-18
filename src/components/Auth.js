import { auth, provider } from '../firebase-config.js';
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie';
import '../App.css'

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

  return ( 
    <div className="w-full absolute h-full flex justify-center items-center bg-[#313338] font-[poppins]">
      <header className='fixed top-0 left-0 w-full h-[50px] bg-[#36383f] flex items-center'>
      <button className='w-[5rem] h-60px bg-[#5a5d62] p-[5px] rounded-[8px] absolute right-2 font-semibold text-[#36383f] hover:bg-[#5f6162] duration-300 hover:text-[#333539]' onClick={signInWithGoogle}> Login</button>
      </header>
    </div>
  )
};