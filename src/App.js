import React, { useState, useRef } from 'react';
import { Auth } from "./components/Auth";
import Cookies from 'universal-cookie';
import { Chat } from "./components/Chat";
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';

const cookies = new Cookies();

const App = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const [inChat, setInChat] = useState(false);
  const roomInputRef = useRef(null);

  const handleSearch = () => {
    setRoom(roomInputRef.current.value);
    setInChat(true);
  };

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
    setInChat(false);
  };

  const handleBackButtonClick = () => {
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <> 
      {inChat ? (
        <Chat room={room} />
      ) : (
        <div style={{ background: 'linear-gradient(to bottom, #191a1c 3.2rem, #141517 3.2rem)' }} className='room w-full absolute h-full flex justify-center items-center font-[Poppins]'>
          <form className='rounded-[10px] border-[#292a2c] border-[2px] absolute w-[70%] h-[2.4rem] flex justify-center top-[6px]'>
          <input className='absolute w-[100%] p-[10px] top-0 outline-none rounded-[10px] bg-[#1c1e1f] text-[#bfc2c5] placeholder-[#757575] h-[35px] text-[15px]' onKeyDown={handleKeyDown} ref={roomInputRef} placeholder='search rooms' />
          <i onClick={handleSearch} className='bx bx-search absolute top-[4px] right-[8px] text-xl font-light text-[#bfc2c5]'></i>
          </form>
        </div>
      )} 
      {inChat ? (
        <i onClick={handleBackButtonClick} className='bx bxs-chevron-left absolute left-[8px] top-[9px] text-[25px] text-[#bfc2c5] hover:text-white duration-300'></i>
      ) : (
        <i onClick={signUserOut} className='bx bx-log-out absolute right-[8px] top-[15px] text-[22px] text-[#bfc2c5]'></i>
      )}
    </>
  );
}

export default App;
