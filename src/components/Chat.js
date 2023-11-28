//! IMPORTS
import line from './assets/line.svg'
import { useEffect, useState } from "react";
import reply from './assets/reply.svg';
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy, deleteDoc, doc, updateDoc, } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";
import CryptoJS from 'crypto-js';
import BadWordsFilter from 'bad-words';
import messageSentSound from './assets/discord_ping_sound_effect.mp3'; // Replace with the path to your audio file

//! EXPORTS
export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);
  const messagesRef = collection(db, "messages");
  const [replyToMessage, setReplyToMessage] = useState(null);
  const filter = new BadWordsFilter();
  let lastMessageTimestamp = null;


  
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
  
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && latestMessage.createdAt && latestMessage.user !== auth.currentUser.displayName && (!lastMessageTimestamp || latestMessage.createdAt.toMillis() > lastMessageTimestamp.toMillis())) {
        const audio = new Audio(messageSentSound);
        audio.play();
        lastMessageTimestamp = latestMessage.createdAt;
      }
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
        const messageContainsBadWords = filter.isProfane(newMessage);
    
        if (messageContainsBadWords) {
          // Message contains bad words, do not submit
          return false;
        }
    
        const messageData = {
          text: newMessage,
          createdAt: serverTimestamp(),
          user: auth.currentUser.displayName,
          room,
          userAvatar: auth.currentUser.photoURL,
          email: auth.currentUser.email,
        };
    
        if (replyToMessage) {
          messageData.replyTo = {
            user: replyToMessage.user,
            text: replyToMessage.text,
          };
    
          setReplyToMessage(null);
        }
    
        await addDoc(messagesRef, messageData);
    
        // Set the timestamp of the last sent message
        lastMessageTimestamp = messageData.createdAt;
      }
    
      setEditingMessage(null);
      setNewMessage(""); // Clear the input after successfully submitting the message
    };
  //! HTML For Chat
  return (
    <div className="bg-[#222328] w-full absolute h-full flex justify-center items-center font-[poppins] right-0 duration-300 md:w-[calc(100%-72px)]">
      <header className=" w-full h-[2.6rem] absolute top-0 flex justify-center items-center border-[#292a2c] border-b-[1px] bg-[#323338c]">
        <h4 className="absolute font-normal text-[#bfc2c5]">{room}</h4>
      </header>
      <div style={{ height: 'calc(100% - 6rem)' }} className="messages w-full overflow-y-auto p-[0] rounded-[5px] mt-[40px] absolute top-0 left-0 duration-300 z-30">
        {messages.map((message) => (
          <div key={message.id} className={`message text-[#dbdee1] bg-[transparent] font-light text-[14px] pl-[5px] pr-[5px] pt-2 pb-2 mt-[11px] relative border-[transparent] border-t-[2px] border-b-[2px] rounded-[5px] hover:bg-[#292a30] hover:border-[transparent] duration-300 break-words ${replyToMessage && replyToMessage.id === message.id ? 'reply-message' : ''}`}>
            {message.replyTo && (
              <div className="reply-indicator text-[12px] pb-0 ml-[3.9rem]">
                <img src={line} className='w-[30px] absolute left-8 top-4'/>
                <span className="reply-user top-[-10px] text-[#9f9f9f] font-medium">@{message.replyTo.user}</span>&nbsp;{message.replyTo.text.slice(0, 20)}...
              </div>
            )}
            {auth.currentUser && auth.currentUser.displayName === message.user && (
              <div className="">
                <i onClick={() => handleDelete(message.id)} className="delete-icon bx bx-trash absolute right-[15px] top-[-10px] text-[#bfc2c5] text-[19px] font- cursor-pointer bg-[#292a30] p-[4px] pl-3 rounded-md border-[#222328] border-[2px] duration-300 opacity-0 hover:text-white"></i>
                <i onClick={() => handleEdit(message.id)} className="edit-icon bx bxs-pencil absolute right-[40px] top-[-10px] text-[19px] text-[#bfc2c5] cursor-pointer bg-[#292a30] p-[4px] rounded-md rounded-tr-none rounded-br-none border-l-[2px] border-b-[2px] border-t-[2px] border-[#222328] duration-300 opacity-0 hover:text-white"></i>
              </div>
            )}
            {(!auth.currentUser || auth.currentUser.displayName !== message.user) && (
            <img src={reply} className="reply-icon w-[30px] rounded-md border-2 border-[#222328] opacity-0 z-10 duration-300 right-[15px] top-[-10px] absolute bg-[#292a30] p-[4px]" alt="" onClick={() => {
            setReplyToMessage(message);
          }}/>
        )}
        {message.userAvatar && (
          <img src={message.userAvatar} alt="User Avatar" className={`avatar w-[36px] rounded-full absolute top-[10px] ml-[0.23rem] sm:ml-[0.7rem] ${ message.replyTo ? 'reply-avatar' : '' }`}/>
        )}
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
      {replyToMessage && (
    <div className="reply-info text-[#757575] p-1 z-40 w-[70%] h-[2rem] text-[13px] flex items-center pl-2 bottom-[55px] absolute bg-[#1e1f22] rounded-md">
      Replying to&nbsp;<span className="text-[#a3a5a8]">{replyToMessage.user}</span><i className="bx bx-x absolute right-2 text-[20px] cursor-pointer" onClick={() => setReplyToMessage(null)}></i>
    </div>
  )}
  <form onSubmit={handleSubmit} className="absolute bottom-[11px] w-[70%] flex justify-center h-[45px] rounded-[10px] bg-[#292a30] z-50">
    <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className="new-message-input placeholder-[#757575] absolute w-[calc(100%-40px)] left-0 p-[10px] bottom-0 rounded-[10px] bg-[#292a30] text-[#bfc2c5] h-[45px] text-[15px] outline-none" placeholder={"Message" + " " + (room)}/>
    <i type="submit" onClick={handleSubmit} className="send-button bx bxs-send right-[8px] text-[20px] bottom-[7px] text-[#bfc2c5] absolute bg-[transparent] p-[5px] rounded-md hover:text-white duration-300"></i>
  </form>
  </div>
  );
};