import React, { useState, useRef } from 'react'
import { Auth } from "./components/Auth"
import Cookies from 'universal-cookie';
import { Chat } from "./components/Chat"

import { signOut } from 'firebase/auth'
import { auth } from './firebase-config'
const cookies = new Cookies()

const App = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"))
  const [room, setRoom] = useState(null)

  const roomInputRef = useRef(null)

  const  signUserOut = async () => {
    await signOut(auth)
    cookies.remove("auth-token")
    setIsAuth(false)
    setRoom(null);
  };

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <> 
      {room ? (
        <Chat room={room}/>
      ) : (
        <div style={{background: 'linear-gradient(to bottom, #36383f 3.2rem, #313338 3.2rem)'}} className='room w-full absolute h-full flex justify-center items-center'>
          <input className='absolute w-[70%] p-[10px] top-[8px] outline-none rounded-[10px] bg-[#3f424a] text-[#bfc2c5] placeholder-[#757575] h-[35px] text-[15px]' ref={roomInputRef} placeholder='search rooms'/>
          <i onClick={() => setRoom(roomInputRef.current.value)} className='bx bx-search absolute top-[12px] right-[15.5%] text-xl font-light text-[#bfc2c5]'></i>
        </div>
      )} 
      <i onClick={signUserOut} className='bx bx-log-out absolute right-[8px] top-[9px] text-[22px] text-[#bfc2c5]'></i>
    </>
  );
}

export default App
