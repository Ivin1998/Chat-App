import {createContext, useContext, useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();


const ChatProvider =({children})=>{

  const [user,setUser] = useState('');
  const [selectedChat, setSelectedChat] = useState();
  const [chats,setChats] = useState([]);
  const [notification,setNotification] = useState([]);


    const navigate = useNavigate();
    useEffect(() => {
      const userinfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userinfo);
      if(!userinfo){
        navigate('/');
      }
    }, [navigate]);

    return (
      <ChatContext.Provider
        value={{
          user,
          setUser,
          selectedChat,
          setSelectedChat,
          chats,
          setChats,
          notification,
          setNotification,
        }}
      >
        {children}
      </ChatContext.Provider>
    );
};

export const ChatState = ()=>{
    return useContext(ChatContext);
}

export default ChatProvider;