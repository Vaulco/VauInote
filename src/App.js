import Home from './components/assets/home.svg';
import Search from './components/assets/search.svg';
import Logs from './components/assets/logout.svg';
import menus from './components/assets/menu.svg';
import React, { useState, useRef } from 'react';
import { Auth } from "./components/Auth";
import Cookies from 'universal-cookie';
import { Chat } from "./components/Chat";
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';;


const cookies = new Cookies();

const App = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const [inChat, setInChat] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const roomInputRef = useRef(null);
  const [menuActive, setMenuActive] = useState(false);

  const handleSearch = () => {
    setRoom(roomInputRef.current.value);
    setInChat(true);
    setShowChat(true);
  };

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
    setInChat(false);
    setShowChat(false);
  };

  const handleBackButtonClick = () => {
    setShowChat(false);
    setInChat(false);
    setRoom(null);
  };

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <>
      <div className='bg-[#141517] room w-full absolute h-full flex justify-center items-center font-[Poppins]'>
        <header className={`absolute right-0 top-0 w-[calc(100%-72px)] justify-center flex h-[2.5rem] bg-[#191a1c] border-b-[1px] border-[#292a2c] items-center duration-300 ${menuActive ? ' active-header' : ''}`}>
        <img onClick={toggleMenu} className='w-[25px] absolute left-2' src={menus} alt='' />
          <h4 className='text-[#bfc2c5]'>Home</h4>
        <form className='rounded-[10px] border-[#292a2c] border-[2px] absolute w-[70%] h-[2.4rem] flex justify-center top-[100px]'>
          <input onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }} className='absolute w-[100%] p-[10px] top-0 outline-none rounded-[10px] bg-[#1c1e1f] text-[#bfc2c5] placeholder-[#757575] h-[35px] text-[15px]' maxLength={32} ref={roomInputRef} placeholder='search rooms' />
          <i onClick={handleSearch} className='bx bx-search absolute top-[4px] right-[8px] text-xl font-light text-[#bfc2c5]'></i>
        </form>
        </header>
        <div className={`w-[72px] h-full absolute bg-[#191a1c] left-0 border-r-[1px] border-[#292a2c] p-[11px] duration-300 ${menuActive ? ' active-form' : ''}`}>
          <div onClick={handleBackButtonClick} className='w-full h-[47.5px] bg-[#18191B] relative top-0 border-2 border-[#292a2c] rounded-2xl flex justify-center mb-[11px] hover:bg-[#1d1e1f] hover:scale-95 duration-300'>
            <img className='w-[25px]' src={Home} alt=''/>
          </div>
          <div  onClick={handleSearch} className='w-full h-[47.5px] bg-[#18191B] relative top-0 border-2 border-[#292a2c] rounded-2xl flex justify-center mb-[11px]'>
            <img className='w-[25px]' src={Search} alt=''/>
          </div>
          <div onClick={signUserOut} className='w-[49px] h-[47.5px] bg-[#18191B] absolute bottom-0 border-2 border-[#292a2c] rounded-2xl flex justify-center mb-[11px] hover:bg-[#1d1e1f] hover:scale-95 duration-300'>
            <img className='w-[22px]' src={Logs} alt=''/>
          </div>
        </div>
      </div>

      {showChat && (
        <Chat room={room} />
      )}
    </>
  );
}

export default App;
