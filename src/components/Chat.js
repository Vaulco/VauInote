//! IMPORTS
import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy, deleteDoc, doc, updateDoc, } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";
import CryptoJS from 'crypto-js';
//! EXPORTS
export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);
  const messagesRef = collection(db, "messages");
  
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAvatar(user.photoURL);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, [room]);

  //! MESSAGES FUNCTION
    //! Delete Messages
  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
    //! Edit Messages
  const handleEdit = async (messageId) => {
    const messageToEdit = messages.find((message) => message.id === messageId);

    if (messageToEdit) {
      setEditingMessage(messageId);
      setNewMessage(messageToEdit.text);
    }
  };
    //! Save Edited Messages
  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "messages", editingMessage), {
        text: newMessage,
      });
      setEditingMessage(null);
      setNewMessage("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };
    //! Check If Message Has Link
  const renderMessageText = (text) => {
  if (!text) {
    return null;
  }

  const linkRegex = /(\b(https?|ftp):\/\/\S+)/gi;
  const parts = text.split(linkRegex);

  return parts.map((part, index) => {
    if (part.match(linkRegex)) {
      return (
        <a key={index} style={{ color: '#60a7f5'}} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    } else if (part === 'http' || part === 'https') {
      return null;
    } else {
      return <span key={index}>{part}</span>;
    }
  });};
    //! Check If User Has The Email To Change Color
  const renderMessageUser = (username, email) => {
    const isDniemtsovEmailHash1 = '2669416d9fe79069c018c934b13bb986745b8170bba3dc1eba479d442153e36e';
    const isDniemtsovEmailHash2 = 'acc8eaf72241bdb72a673e4e056ba3b189f10b044c56c3d035ab3b4e96d63bf6';
    const hashedEnteredEmail = CryptoJS.SHA256(email).toString().toLowerCase();
  
    const style = (() => {
      if (hashedEnteredEmail === isDniemtsovEmailHash1) {
        return {
          color: '#6097d5',
          fontWeight: 'bold', 
          fontSize: '14px',
          background: '-webkit-linear-gradient(#6097d5, #fff',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
          // Add more styling properties here
        };
      } else if (hashedEnteredEmail === isDniemtsovEmailHash2) {
        return {
          color: '#EDAD2E',
        };
      } else {
        return {
          color: '#fff',
        };
      }
    })();
  
    return (
      <span className="text-[#fff] font-medium" style={style}>
        {username.length > 16 ? username.split(' ')[0] : username}&nbsp;&nbsp;
      </span>
    );
  };
    //! Submit Messages
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingMessage !== null) {
      saveEdit();
    } else {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
        userAvatar: auth.currentUser.photoURL, // Added this line
        email: auth.currentUser.email,
      });
    }

    setEditingMessage(null);
    setNewMessage("");
  };
  //! HTML For Chat
  return (
    <div className="bg-[#222328] w-full absolute h-full flex justify-center items-center font-[poppins] right-0 duration-300 md:w-[calc(100%-72px)]">
      <header className=" w-full h-[2.6rem] absolute top-0 flex justify-center items-center border-[#292a2c] border-b-[1px] bg-[#323338c]">
        <h4 className="absolute font-normal text-[#bfc2c5]">{room}</h4>
      </header>
      <div style={{ height: 'calc(100% - 6rem)' }} className="messages w-full overflow-y-auto p-[0] rounded-[5px] mt-[40px] absolute top-0 left-0 duration-300">
        {messages.map((message) => (
          <div key={message.id} className="message text-[#dbdee1] bg-[transparent] font-light text-[14px] pl-[5px] pr-[5px] pt-2 pb-2 mt-[11px] relative border-[transparent] border-t-[2px] border-b-[2px] rounded-[5px] hover:bg-[#292a30] hover:border-[transparent] duration-300 break-words">
            {auth.currentUser && auth.currentUser.displayName === message.user && (
              <div className="">
                <i onClick={() => handleDelete(message.id)} className="delete-icon bx bx-trash absolute right-[15px] top-[-10px] text-[#bfc2c5] text-[19px] font- cursor-pointer bg-[#292a30] p-[4px] pl-3 rounded-md border-[#222328] border-[2px] duration-300 opacity-0 hover:text-white"></i>
                <i onClick={() => handleEdit(message.id)} className="edit-icon bx bxs-pencil absolute right-[40px] top-[-10px] text-[19px] text-[#bfc2c5] cursor-pointer bg-[#292a30] p-[4px] rounded-md rounded-tr-none rounded-br-none border-l-[2px] border-b-[2px] border-t-[2px] border-[#222328] duration-300 opacity-0 hover:text-white"></i>
              </div>
            )}
            {message.userAvatar && <img src={message.userAvatar} alt="User Avatar" className="avatar w-[36px] rounded-full absolute top-[10px] ml-[0.23rem] sm:ml-[0.7rem]" />}
            <span className="text-[#fff] font-medium ml-[2.9rem] sm:ml-[4rem]">
              {renderMessageUser(message.user, message.email)}
            </span>
            <span className="text-[#9499a0] text-xs font-normal">
              {message.createdAt && message.createdAt.toDate() && (
                <>
                  {message.createdAt.toDate().toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  {message.createdAt.toDate().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </>
              )}<br/>
            </span>
            <span className="ml-[2.9rem] sm:ml-[4rem]">
              {renderMessageText(message.text)}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="absolute bottom-[11px] w-[70%] flex justify-center h-[45px] rounded-[10px] bg-[#292a30] ">
        <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className="new-message-input placeholder-[#757575] absolute w-[calc(100%-40px)] left-0 p-[10px] bottom-0 rounded-[10px] bg-[#292a30] text-[#bfc2c5] h-[45px] text-[15px] outline-none" placeholder={"Message" + " " + (room)}/>
        <i type="submit" onClick={handleSubmit} className="send-button bx bxs-send right-[8px] text-[20px] bottom-[7px] text-[#bfc2c5] absolute bg-[transparent] p-[5px] rounded-md hover:text-white duration-300"></i>
      </form>
    </div>
  );
};