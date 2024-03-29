import  { useEffect, useState } from 'react';
import { ChatState } from '../context/chatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { REACT_SERVER_URL } from "../config/env";
import { IoMdAdd } from "react-icons/io";
import ChatLoading from './ChatLoading';
import {getSender} from './miscellaneous/ChatLogics';
import GroupModelChat from './GroupModelChat';


const Mychats = ({ fetchAgain }) => {
  const [loggedUser, setLoggeduser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${REACT_SERVER_URL}/api/chats`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to Load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "100%" }}
      h={{ base: "100%", md: "100%" }}
      borderRadius="5px"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
        <GroupModelChat>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<IoMdAdd />}
          >
            {" "}
            New Group Chat
          </Button>
        </GroupModelChat>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
              >
                <Text>
                  {!chat?.isGroupChat
                    ? getSender(loggedUser || {}, chat?.users)
                    : chat?.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Mychats;
