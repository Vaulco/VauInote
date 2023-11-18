import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { auth, db } from "../firebase-config";
import '../App.css'

export const Chat = (props) => {
  const {room} = props
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([])
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));
      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        let messages = [];
          snapshot.forEach((doc) => {
            messages.push({...doc.data(), id: doc.id});
          });
          setMessages(messages);
        });
        return () => unsubscribe();
  }, []);

  const handlSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });
    setNewMessage("")
  };

  return (
    <div style={{background: 'linear-gradient(to bottom, #36383f 2.5rem, #313338 2.5rem)'}} className="w-full absolute h-full flex justify-center items-center"> 
      <h4 className="absolute font-light top-[8px] text-[#bfc2c5]">{room}</h4>
      <div style={{height: 'calc(100% - 6rem)'}} className="w-full overflow-y-auto p-[8px] rounded-2xl mt-[40px] absolute  top-0 left-0"> 
        {messages.map((message) => (
          <div key={message.id} className="text-[#dbdee1] font-light text-[14px] p-[5px] m-[8px] relative">
            <span className="text-[#fff] font-medium">{message.user}&nbsp;</span>
            <span className="text-[#9499a0] text-xs font-normal"> {message.createdAt && message.createdAt.toDate() && (
              <>
                {message.createdAt.toDate().toLocaleDateString('en-US')} {' '}
                {message.createdAt.toDate().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </>
            )}<br/></span>{message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handlSubmit}  className="absolute bottom-[8px] w-full flex justify-center">
        <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className="new-message-input placeholder-[#757575] absolute w-[70%] p-[10px] bottom-0 rounded-[10px] bg-[#383a40] text-[#bfc2c5] h-[45px] text-[15px] outline-none" placeholder={"Message"+" "+(room)}/>
        <i onClick={handlSubmit}type="submit" className="send-button bx bxs-send right-[15.5%] text-xl bottom-[8px] text-[#bfc2c5] absolute"></i>
      </form> 
    </div>
  )
};