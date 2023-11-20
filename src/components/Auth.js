import { auth, provider } from '../firebase-config.js';
import { signInWithPopup } from 'firebase/auth'
import Cookies from 'universal-cookie';
import '../App.css'
import logo from './assets/Untitled.png'

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
    <div className="w-full absolute h-full flex justify-center items-center bg-[#141517] font-[poppins]">
      <header className='fixed top-0 left-0 w-full h-[50px] bg-[#191a1c] flex items-center'>
      <img className='absolute w-[30px] left-[0.5rem]' src={logo} alt=''/>
      <h1 className='font-semibold text-[#bfc2c5] absolute left-[3rem] text-[25px]'>Vaulnote</h1>

      

      <button className='w-[5rem] h-60px bg-[#1d1e1f] p-[5px] rounded-[8px] absolute right-2 font-semibold text-[#919495] duration-300 border-[2px] border-[#292a2c]' onClick={signInWithGoogle}>Login</button>
      </header>
    </div>
  )
};