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
    return  (
        <div className="chat-app"> 
            <h4>{room}</h4>
            <div className="messages"> 
                {messages.map((message) => (
                    <div key={message.id} className="message">
                        <span className="user">{message.user}&nbsp;</span><span className="date"> {message.createdAt && message.createdAt.toDate() && (
            <>
                {message.createdAt.toDate().toLocaleDateString('en-US')} {' '}
                {message.createdAt.toDate().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        })}{' '}
            </>
        )}<br></br></span>{message.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handlSubmit}  className="new-message-form">
                <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className="new-message-input" placeholder={"Message"+" "+(room)}/>
                <button type="submit" className="send-button bx bxs-send"></button>
            </form> 
        </div>
    )
};