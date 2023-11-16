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
        <div className='room'>
          <input className='room-input' ref={roomInputRef} placeholder='search rooms'/>
          <i onClick={() => setRoom(roomInputRef.current.value)} className='bx bx-search'></i>
        </div>
      )} 
      
      <div className='sign-out'>
        <i onClick={signUserOut} className='bx bx-log-out'></i>
      </div>
    </>
  );
}

export default App
