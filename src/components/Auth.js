import { auth, provider } from '../firebase-config.js';
import patern from'./assets/low-poly-grid-haikei.svg';
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
    <div className="boxes w-full relative h-[100vh] flex justify-center items-center font-[poppins]">
      <header className='z-10 bg-opacity-90 fixed top-0 left-0 w-full h-[60px] flex items-center justify-center'>
      <img className='absolute w-[30px] left-[1rem] top-5' src={logo} alt=''/>
      <h1 className='font-semibold text-[#bfc2c5] absolute left-[3.5rem] top-4 text-[25px]'>Vaulnote</h1>
      <button className='w-[5rem] h-60px top-4 bg-[#1d1e1f] p-[5px] rounded-[8px] absolute right-4 font-semibold text-[#919495] duration-300 border-[2px] border-[#292a2c]' onClick={signInWithGoogle}>Login</button>
      </header>
      <h2 className='absolute font-extrabold text-[30px] w-4/6 flex justify-center text-center text-[#bfc2c5] top-[10rem] sm:text-[40px] md:text-[55px] md:w-full'>Explore and Connect!</h2>
      <button className='absolute w-[13rem] h-[50px] bg-[#1d1e1f] top-[20rem] p-[5px] rounded-[12px] text-[18px]  font-semibold text-[#a3a7a8] duration-300 border-[4px] border-[#444549] hover:shadow-[0px_0px_50px_0px_rgba(25,26,28)] hover:scale-105' onClick={signInWithGoogle}>Open in browser</button>
    </div>
  )
};