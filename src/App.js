import { collection, addDoc, getDocs, getDoc, where, query, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase-config';
import bookmark from './components/assets/bookmark.svg';
import settings from './components/assets/settings.svg'
import React, { useEffect, useState, useRef } from 'react';
import { Auth } from "./components/Auth";
import Cookies from 'universal-cookie';
import { Chat } from "./components/Chat";
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';

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
  const [bio, setBio] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const displayName = auth.currentUser ? auth.currentUser.displayName : '';
  const email = auth.currentUser ? auth.currentUser.email : '';

  useEffect(() => {
    const loadUserBio = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
    
          setBio((prevBio) => {
            return userDocSnapshot.exists() ? userDocSnapshot.data().bio : '';
          });
        } catch (error) {
          console.error('Error loading user bio: ', error);
        }
      }
    };

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

    loadUserBio();

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

  const closeMenu = () => {
    setMenuActive(false);
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const toggleBioEditing = () => {
    setIsEditingBio(!isEditingBio);
  };

  const saveBio = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
  
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          bio: bio,
        });
      } else {
        await setDoc(userDocRef, {
          uid: auth.currentUser.uid,
          bio: bio,
        });
      }
  
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error saving bio: ', error);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current && e.changedTouches.length) {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY.current;

      if (deltaY > 50) {
        setShowSettings(false);
      }

      touchStartY.current = null;
    }
  };

  const closeSettings = () => {
    setShowSettings(false);
  }

  const touchStartY = useRef(null);

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <>
      <div onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd} className='bg-[#212328] room w-full md:w-[calc(100%-72px)] right-0 absolute h-full flex justify-center items-center font-[Poppins]'>
        <header onClick={(() => { closeMenu(); closeSettings(); })} className={`absolute right-0 top-0 w-full justify-center flex h-[2.5rem] bg-[#212328] items-center duration-300 ${menuActive ? ' active-header' : ''}`}>
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
        <div className={`w-[72px] h-full absolute bg-[#191a1d] left-[-72px] p-[11px] duration-300 flex flex-col items-center z-40 md:left-[-72px] ${menuActive ? ' active-form' : ''}`}>
          <i onClick={toggleMenu} className='bx bx-menu text-[#bfc2c5] text-[26px] font-thin absolute z-10 ml-28 mt-[-4px] md:hidden'></i>
          <div onClick={(() => { handleBackButtonClick(); closeSettings(); closeMenu(); })} className='w-full h-[47.5px] bg-[#212328] relative top-0  rounded-xl flex justify-center mb-[11px] hover:scale-95 duration-300 hover:bg-[#292a30] cursor-pointer items-center'>
            <i className='bx bxs-home text-[25px] text-[#bfc2c5]' ></i>
          </div>
          <div className='w-[25px] h-[2px] bg-[#bfc2c5] rounded-sm'></div>
          <div className='chat-container w-[49.5px] top-[76.2px] h-[calc(100%-8.77rem)] mt-[5.5px] absolute overflow-y-auto'>
            {savedRooms.map((savedRoom) => (
              <div key={savedRoom} className='w-[49.5px] h-[47.5px] bg-[#212328] relative top-0 rounded-xl flex justify-center mb-[11px] hover:scale-95 duration-300 hover:bg-[#292a30] cursor-pointer items-center' onClick={(() => { handleOpenSavedRoom(savedRoom); closeMenu(); closeSettings(); })}>
                <i className='bx bxs-chat text-[25px] text-[#bfc2c5]'></i>
              </div>
            ))}
          </div>
          <div onClick={toggleSettings} className='w-[49.5px] h-[47.5px] p-[7px] bg-[#222328] absolute bottom-0  rounded-xl flex justify-center mb-[11px] hover:scale-95 duration-300 hover:bg-[#292a30] cursor-pointer'>
            {Logs && <img className='rounded-full' src={Logs} alt='' />}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(to bottom, #bfc2c5 4rem, #292a30 4rem)', }} className={` settings-box w-full h-[397.5px] -bottom-[397.5px] z-50 rounded-t-xl pointer-events-none absolute duration-300 border-l-2 border-r-2 border-[#292830] sm:w-[340px] flex flex-col items-center ${showSettings ? 'show' : ''}`}>
          <div className='w-1/12 absolute top-0 bg-[#292a30] h-[3px] m-2 rounded-sm'></div>
          <img onClick={(() => { signUserOut(); closeSettings(); })} className='m-3 w-[22px] absolute right-0 bottom-0 cursor-pointer' src={settings} alt='' />
          <img className='w-[5.5rem] rounded-full left-0 m-5 mt-4 border-[6px] absolute border-[#292a30]' src={Logs} alt='' />
          <div className='w-[94%] rounded-xl h-[240px] bg-[#1e1f23] mt-28 p-3'>
            <span className='text-[#bfc2c5] font-medium relative'>{displayName}<br /></span>
            <span className='text-[#bfc2c5] text-[15px] font-thin relative'>{email}</span>
            {isEditingBio ? (
              <textarea
                value={bio}
                onChange={(e) => setBio((prevBio) => e.target.value)}
                className='w-[100%] h-[calc(100%-50px)] resize-none bg-[#1e1f23] text-[14px] font-normal text-[#bfc2c5]  border-none outline-none overflow-hidden'
                placeholder='Type your bio...'
              />
            ) : (
              <div className='text-[#bfc2c5] text-[14px] font-normal relative break-words'>{bio}</div>
            )}

            <div className='top-0'>
              {isEditingBio ? (
                <div className='absolute bottom-3 left-4 w-[20rem] inline-block'>
                  <h4 className='text-[#bfc2c5] inline-block text-[12px]'>esacape to</h4><span onClick={toggleBioEditing} className='cursor-pointer text-[#3498db] text-[12px] w-[10rem] hover:underline'> Cancel </span>
                  <h4 className='text-[12px] inline-block text-[#bfc2c5]'> • enter to</h4>&nbsp;<span onClick={saveBio} className='cursor-pointer text-[#3498db] text-[12px] w-[10rem] hover:underline'>Save</span>
                </div>
              ) : (
                <i onClick={toggleBioEditing} className='bx bxs-pencil cursor-pointer text-[20px]  text-[#464747] hover:text-[#5a5b5b] duration-300 absolute right-2 top-2'></i>
              )}
            </div>
          </div>
        </div>
      </div>
      <div onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd} onClick={(() => { closeMenu(); closeSettings(); })}>
        {showChat && (
          <Chat room={room} />
        )}
      </div>

      {inChat && (
        <img onClick={handleSaveRoom} className="absolute top-2  right-2 text-[22px] text-[#bfc2c5] font-thin cursor-pointer hover:text-white duration-300 w-[25px]" src={bookmark} alt='' />
      )}

    </>
  );
}

export default App;
