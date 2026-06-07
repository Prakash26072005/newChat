import { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import Conversation from "../Conversation/conversation";
import Chats from "../Chats/chats";
import api from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = ({ setLoginFunc }) => {
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [selectUserDetails, setSelectedUserDetails] = useState([]);
  const [queryParam, setQueryParam] = useState("");
  const [searchData, setSearchedData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isAIChat, setIsAIChat] = useState(false);
  const [conversation, setConversation] = useState([]);
  const ref = useRef();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const ownId = userInfo?._id;

  const handleSelectedUser = (id, userDetails) => {
  setSelectedUserDetails(userDetails);
  setSelectedId(id);
  setIsAIChat(false);

  if (window.innerWidth <= 768) {
    setShowChatMobile(true);
  }

  socket.emit("joinConversation", id);
};
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setSearchedData([]);
        setQueryParam("");
      }
    };

    if (searchData.length) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchData]);

  const fetchConversation = async () => {
    try {
      const res = await api.get(
       "/api/conversation/get-conversation",
        { withCredentials: true },
      );
      setConversation(res.data.conversations);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserBySearch = async () => {
    try {
      const res = await api.get(
        `/api/auth/searchedMember?queryParam=${queryParam}`,
        { withCredentials: true },
      );
      setSearchedData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (queryParam.length !== 0) {
      fetchUserBySearch();
    } else {
      setSearchedData([]);
      
    }
  }, [queryParam]);

  useEffect(() => {
    if (!ownId) {
      navigate("/");
      return;
    }

    fetchConversation();
  }, [navigate, ownId]);
  
  const handleLogout = async () => {
    try {
      await api.post(
        "/api/auth/logout",
        {},
        { withCredentials: true },
      );
      localStorage.clear();
      setLoginFunc(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateConv = async (id) => {
    try {
      const response =await api.post(
        "/api/conversation/add-conversation",
        { recieverId: id },
        { withCredentials: true },
      );
        toast.success(
      response.data.message
    );
      fetchConversation();
      setSearchedData([]);
      setQueryParam("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard">
         <ToastContainer />
      <div className="dashboard-card">
        {/* <div className="dashboard-conversations"> */}
        <div
  className={`dashboard-conversations ${
    showChatMobile ? "mobile-hide" : ""
  }`}
>
          <div className="dashboard-conv-block">
            <div className="dashboard-title-block">
              <div>Chats</div>
              <div onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: "32px", cursor: "pointer" }} />
              </div>
            </div>
            <div className="searchBoxDiv">
              <input
                type="text"
                value={queryParam}
                onChange={(event) => {
                  setQueryParam(event.target.value);
                }}
                placeholder="Search"
                className="searchBox"
              />
              <button className="searchIcon">
                <SearchIcon />
              </button>

              {searchData.length ? (
                <div ref={ref} className="searched-box">
                  {searchData.map((item, index) => (
                    <div
                      key={index}
                      className="search-item"
                      onClick={() => handleCreateConv(item._id)}
                    >
                      <img
                        src={item.profilePic}
                        className="search-item-profile"
                        alt=""
                      />
                      <div>{item.name}</div>
                      <div className="search-item-mobile">
                        {item.mobileNumber}
                      </div>
                    </div>
                  ))}
                </div>
              ) : queryParam.length !== 0 ? (
                <div ref={ref} className="searched-box">
                  <div className="search-item">
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/021/975/489/small_2x/search-not-found-3d-render-icon-illustration-with-transparent-background-empty-state-png.png"
                      className="search-item-profile"
                      alt=""
                    />
                    <div>No data found</div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="conv-block">

              <div
  className={`conv ${isAIChat ? "active-class" : ""}`}
  onClick={async () => {

  const response = await api.post(
    "/api/conversation/create-ai",
    {},
    {
      withCredentials:true
    }
  );
  setSelectedId(
    response.data._id
  );
  setIsAIChat(true);

  const aiUser =
    response.data.members.find(
      item =>
      item._id !== ownId
    );

  setSelectedUserDetails([
    aiUser
  ]);
    if (window.innerWidth <= 768) {
    setShowChatMobile(true);
  }

  socket.emit(
    "joinConversation",
    response.data._id
  );
}}

>
  <div className="conv-profile-img">
    <img
      className="profile-img-conv"
      src="https://tse3.mm.bing.net/th/id/OIP.H3twlxE3n7ME2gMJP6rzLAHaE8?r=0&cb=thfvnextfalcon&w=540&h=360&rs=1&pid=ImgDetMain&o=7&rm=3"
      alt=""
    />
  </div>

  <div className="conv-name">
    <div className="conv-profile-name">
      Maya
    </div>

    <div className="conv-last-message">
      Ask Anything...
    </div>
  </div>
</div>
              {conversation.map((item) => {
                return (
                  <Conversation
                    active={item._id === selectedId}
                    handleSelectedUser={handleSelectedUser}
                    item={item}
                    id={item._id}
                    members={item.members}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
          {selectUserDetails.length > 0 &&
(window.innerWidth > 768 || showChatMobile) ? (
  <Chats
    selectedId={selectedId}
    selectUserDetails={selectUserDetails}
    isAIChat={isAIChat}
    setShowChatMobile={setShowChatMobile}
  />
) : 
  <div className="noChatSeleceted">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/people-chatting-on-phone-8044282-6369994.png"
              className="noChatImage"
              alt=""
            />
            <div>No chat selected</div>
          </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
