import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import "../App.css";
import { onAuthStateChanged } from "firebase/auth";

export const Chat = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null); // Added state for user's avatar
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

    // Fetch user's avatar when component mounts
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAvatar(user.photoURL);
      }
    });

    // Cleanup functions
    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, [room]);

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEdit = async (messageId) => {
    const messageToEdit = messages.find((message) => message.id === messageId);

    if (messageToEdit) {
      setEditingMessage(messageId);
      setNewMessage(messageToEdit.text);
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage("");
  };

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
      });
    }

    setEditingMessage(null);
    setNewMessage("");
  };

  return (
    <div
      style={{ background: 'linear-gradient(to bottom, #191a1c 2.5rem, #141517 2.5rem)' }}
      className="w-full absolute h-full flex justify-center items-center font-[poppins]"
    >
      <h4 className="absolute font-normal top-[8px] text-[#bfc2c5]">{room}</h4>
      <div
        style={{ height: 'calc(100% - 6rem)' }}
        className="messages w-full overflow-y-auto p-[0] rounded-[5px] mt-[40px] absolute top-0 left-0"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className="message text-[#dbdee1] bg-[transparent] font-light text-[14px] p-[5px] mt-[8px] relative border-[transparent] border-t-[2px] border-b-[2px] rounded-[5px] hover:bg-[#18191b] hover:border-[#292a2c] duration-300 break-words"
          >
            {auth.currentUser && auth.currentUser.displayName === message.user && (
              <div className="">
                <i
                  onClick={() => handleDelete(message.id)}
                  className="delete-icon bx bx-trash absolute right-[15px] top-[-10px] text-[#bfc2c5] text-[19px] font- cursor-pointer bg-[#18191b] p-[4px] pl-3 rounded-md border-[#292a2c] border-2 duration-300 opacity-0 hover:text-white"
                ></i>
                <i
                  onClick={() => handleEdit(message.id)}
                  className="edit-icon bx bxs-pencil absolute right-[40px] top-[-10px] text-[19px] text-[#bfc2c5] cursor-pointer bg-[#18191b] p-[4px] rounded-md rounded-tr-none rounded-br-none border-l-2 border-b-2 border-t-2 border-[#292a2c] duration-300 opacity-0 hover:text-white"
                ></i>
              </div>
            )}
            {message.userAvatar && <img src={message.userAvatar} alt="User Avatar" className="avatar w-[30px] rounded-full absolute top-[10px] ml-[0.23rem]" />}
            <span className="text-[#fff] font-medium ml-[2.6rem]">{message.user}&nbsp;</span>
            <span className="text-[#9499a0] text-xs font-normal">
              {message.createdAt && message.createdAt.toDate() && (
                <>
                  {message.createdAt.toDate().toLocaleDateString('en-US')} {' '}
                  {message.createdAt.toDate().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
                </>
              )}
              <br />
            </span>
            <span className="ml-[2.6rem]">{message.text}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-[8px] w-[70%] flex justify-center shadow-[-1px_-10px_20px_0px_rgba(25,26,28)] h-[3rem] rounded-[10px] bg-[#18191b] border-[#292a2c] border-[1px]"
      >
        <input
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          className="new-message-input placeholder-[#757575] absolute w-[calc(100%-40px)] left-0 p-[10px] bottom-0 rounded-[10px] bg-[#18191b] text-[#bfc2c5] h-[45px] text-[15px] outline-none"
          placeholder={"Message" + " " + (room)}
        />
        <i
          type="submit"
          onClick={handleSubmit}
          className="send-button bx bxs-send right-[8px] text-[20px] bottom-[7px] text-[#bfc2c5] absolute bg-[#272727] p-[5px] rounded-md hover:text-white duration-300"
        ></i>
      </form>
    </div>
  );
};
