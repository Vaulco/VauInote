import { collection, addDoc, getDocs, where, query } from 'firebase/firestore';
import { db } from './firebase-config';
import bookmark from './components/assets/bookmark.svg';
import settings from './components/assets/settings.svg'
import React, { useEffect, useState, useRef } from 'react';
import { Auth } from "./components/Auth";
import Cookies from 'universal-cookie';
import { Chat } from "./components/Chat";
import { signOut, getAuth, onAuthStateChanged, } from 'firebase/auth';
import { logDOM } from '@testing-library/react';

const cookies = new Cookies();

const App = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const [inChat, setInChat] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const roomInputRef = useRef(null);
  const [menuActive, setMenuActive] = useState(false);
  const [savedRooms, setSavedRooms] = useState([]);
  const auth = getAuth();
  const Logs = auth.currentUser ? auth.currentUser.photoURL : '';
  const [showSettings, setShowSettings] = useState(false);



  useEffect(() => {
    const loadSavedRooms = async () => {
      if (auth.currentUser) {
        try {
          const q = query(
            collection(db, 'savedRooms'),
            where('uid', '==', auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          const loadedRooms = [];
          querySnapshot.forEach((doc) => {
            loadedRooms.push(doc.data().room);
          });
          setSavedRooms(loadedRooms);
        } catch (error) {
          console.error('Error loading documents: ', error);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadSavedRooms();
      } else {
        setSavedRooms([]);
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleSaveRoom = async () => {
    if (room && !savedRooms.includes(room) && auth.currentUser) {
      const newSavedRooms = [...savedRooms, room];
      setSavedRooms(newSavedRooms);

      try {
        await addDoc(collection(db, 'savedRooms'), {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email,
          room: room,
        });
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  const handleOpenSavedRoom = (savedRoom) => {
    setRoom(savedRoom);
    setInChat(true);
    setShowChat(true);
  };

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

  const toggleMenu = () => {
    setMenuActive(!menuActive);
    setShowSettings(false);
  };

  const toggleSettings = () => {
  setShowSettings(!showSettings);
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
      <div className='bg-[#212328] room w-full absolute h-full flex justify-center items-center font-[Poppins]'>
        <header className={`absolute right-0 top-0 w-full justify-center flex h-[2.5rem] bg-[#212328] items-center duration-300 md:w-[calc(100%-72px)] ${menuActive ? ' active-header' : ''}`}>
          <h4 className='text-[#bfc2c5]'>Home</h4>
          <form className='rounded-[10px] absolute w-[70%] bg-[#292a30] h-[40px] flex justify-center top-[100px]'>
            <input onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }} className='absolute w-[calc(100%-34px)] left-0 p-[10px] top-0 outline-none rounded-[10px] bg-[#292a30] text-[#bfc2c5] placeholder-[#757575] h-[40px] text-[15px]' maxLength={32} ref={roomInputRef} placeholder='search rooms' />
            <i onClick={handleSearch} className='bx bx-search absolute top-[6px] right-[10px] text-xl font-light text-[#bfc2c5]'></i>
          </form>
        </header>
        <div className={`w-[72px] h-full absolute bg-[#191a1d] left-[-72px] p-[11px] duration-300 flex flex-col items-center z-40 md:left-0 ${menuActive ? ' active-form' : ''}`}>
          <i onClick={toggleMenu} className='bx bx-menu text-[#bfc2c5] text-[26px] font-thin absolute z-10 ml-28 mt-[-4px] md:hidden'></i>
          <div onClick={handleBackButtonClick} className='w-full h-[47.5px] bg-[#212328] relative top-0  rounded-xl flex justify-center mb-[11px] hover:scale-95 duration-300 hover:bg-[#292a30] cursor-pointer items-center'>
            <i className='bx bxs-home text-[25px] text-[#bfc2c5]' ></i>
          </div>
          <div className='w-[25px] h-[2px] bg-[#bfc2c5] rounded-sm'></div>
          <div className='chat-container w-[49.5px] top-[76.2px] h-[calc(100%-8.77rem)] mt-[5.5px] absolute overflow-y-auto'>
            {savedRooms.map((savedRoom) => (
              <div key={savedRoom} className='w-[49.5px] h-[47.5px] bg-[#212328] relative top-0 rounded-xl flex justify-center mb-[11px] hover:scale-95 duration-300 hover:bg-[#292a30] cursor-pointer items-center' onClick={() => handleOpenSavedRoom(savedRoom)}>
                <i className='bx bxs-chat text-[25px] text-[#bfc2c5]'></i>
              </div>
            ))}
          </div>
          <div onClick={toggleSettings} className='w-[49.5px] h-[47.5px] p-[7px] bg-[#222328] absolute bottom-0  rounded-xl flex justify-center mb-[11px] hover:scale-95 duration-300 hover:bg-[#292a30] cursor-pointer'>
            {Logs && <img className='rounded-full' src={Logs} alt='' />}
          </div>
        </div>

        <div style={{background: 'linear-gradient(to bottom, #bfc2c5 4rem, #292a30 4rem)',}} className={` settings-box w-[calc(100%-22px)] h-[397.5px] z-50 left-[11px] bottom-[69.5px] rounded-xl opacity-0 pointer-events-none absolute duration-300 sm:w-[340px] ${showSettings ? 'show' : ''}`}>
          <img onClick={signUserOut} className='m-3 w-[22px] absolute right-0 bottom-0 cursor-pointer' src={settings} alt=''/>
          <img className='w-[5.5rem] rounded-full m-5 mt-4 border-[6px] border-[#292a30]' src={Logs} alt=''/>
        </div>
      </div>

      {showChat && (
        <Chat room={room} />
      )}

      {inChat && (
          <img onClick={handleSaveRoom} className="absolute top-2  right-2 text-[22px] text-[#bfc2c5] font-thin cursor-pointer hover:text-white duration-300 w-[25px]" src={bookmark} alt=''/>
      )}

    </>
  );
}

export default App;