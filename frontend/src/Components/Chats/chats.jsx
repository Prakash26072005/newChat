import { useEffect, useState, useRef} from "react";
import "./chats.css"
import axios from "axios";
import socket from "../../socket";
import SendIcon from "@mui/icons-material/Send";
const Chats = ({selectedId, selectUserDetails}) => {
 const [content, setContent] = useState("");
   const [chats, setChats] = useState([]);

  const ownId = JSON.parse(localStorage.getItem("userInfo"))._id;
const ref= useRef();
   const fetchMsg = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/chat/get-message-chat/${selectedId}`,
      { withCredentials: true }
    );

    setChats(response.data.message);
  } catch (err) {
    console.log(err);
  }
};

const handleAIChat = async () => {
  if (!content.trim()) return;

  const ownUser = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const userMessage = {
    sender: ownUser,
    message: content,
  };

  setChats((prev) => [...prev, userMessage]);

  const currentMessage = content;

  setContent("");

  try {
    const response = await axios.post(
      "http://localhost:8000/api/ai/ask",
      {
        prompt: currentMessage,
      },
      {
        withCredentials: true,
      }
    );

    const aiMessage = {
      sender: {
        name: "Unixa AI",
        profilePic:
          "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
      },
      message: response.data.reply,
    };

    setChats((prev) => [...prev, aiMessage]);
  } catch (err) {
    console.log(err);
  }
};

const handleSendMessage = async () => {

   if (selectedId === "AI") {
    handleAIChat();
    return;
  }

  if (content.trim().length == 0)
    return alert("Please Enter Message");

  await axios
    .post(
      "http://localhost:8000/api/chat/post-message-chat",
      {
        conversation: selectedId,
        content: content,
      },
      { withCredentials: true }
    )
    .then((response) => {
      //  socket.emit("sendMessage",selectedId,response.data);
      socket.emit("sendMessage", selectedId, response.data.message);
setContent("");
    })
    .catch((err) => {
      console.log(err);
    });
};

useEffect(()=>{
  socket.on("receiveMessage",(response)=>{
    setChats([...chats,response])
  })
},[chats])

//  useEffect(() => {
 
//     fetchMsg();
//     setContent("")
  
// }, [selectedId]);

useEffect(() => {

  if (selectedId === "AI") {
    setChats([]);
    setContent("");
    return;
  }

  fetchMsg();
  setContent("");

}, [selectedId]);


useEffect(()=>{
ref?.current?.scrollIntoView({behavior:"smooth"})
})
  return (
   <div className="dashboard-chats">
    <div className="chatNameBlock">
        <div className="chat-profile-img">
                            <img src={selectUserDetails[0]?.profilePic} />
        </div>
        <div className="chat-name">{selectUserDetails[0]?.name}</div>
    </div>
  <div className="chats-block">

{
  chats.map((item, index) => {
    return (
      <div
      ref={ref}
        key={index}
        className={`chat ${ownId === item.sender?._id ? "message-me" : null}`}
      >
        <div className="chat-send-rev_image">
          <img
            className="profile-img-conv"
            src={item.sender?.profilePic}
            alt=""
          />
        </div>

        <div className="message">{item.message}</div>
      </div>
    );
  })
}
      
    </div>
    <div className="message-box">
      
<div className="message-input-box">
  <input     value={content}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }}

            onChange={(e) => setContent(e.target.value) } placeholder="Type Your Message Here" className="searchBox messageBox"/>
</div>
<div onClick={handleSendMessage}>
    <SendIcon
            sx={{ fontSize: "32px", margin: "10px", cursor: "pointer" }}
          />
</div>
    </div>
  </div>

  )
}

export default Chats