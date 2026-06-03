import { useState, useEffect, useRef } from "react";
import "./dashboard.css";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import Conversation from "../Conversation/conversation";
import Chats from "../Chats/chats";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

const Dashboard = ({ setLoginFunc }) => {
  const [selectUserDetails, setSelectedUserDetails] = useState([]);
  const [queryParam, setQueryParam] = useState("");
  const [searchData, setSearchedData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isAIChat, setIsAIChat] = useState(false);
  const [conversation, setConversation] = useState([]);
  const ref = useRef();
  const navigate = useNavigate();
  const ownId = JSON.parse(localStorage.getItem("userInfo"))._id;

  const handleSelectedUser = (id, userDetails) => {
    setSelectedUserDetails(userDetails);
    setSelectedId(id);
    setIsAIChat(
      userDetails.some((item) => item?.name === "Unixa AI")
    );

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
      const res = await axios.get(
        "http://localhost:8000/api/conversation/get-conversation",
        { withCredentials: true },
      );
      setConversation(res.data.conversations);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserBySearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/auth/searchedMember?queryParam=${queryParam}`,
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
    fetchConversation();
  }, []);
  
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/auth/logout",
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
      await axios.post(
        "http://localhost:8000/api/conversation/add-conversation",
        { recieverId: id },
        { withCredentials: true },
      );
      fetchConversation();
      setSearchedData([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <div className="dashboard-conversations">
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
                      src="https://via.placeholder.com/40"
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

  const response = await axios.post(
    "http://localhost:8000/api/conversation/create-ai",
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

  socket.emit(
    "joinConversation",
    response.data._id
  );
}}

>
  <div className="conv-profile-img">
    <img
      className="profile-img-conv"
      src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
      alt=""
    />
  </div>

  <div className="conv-name">
    <div className="conv-profile-name">
      Unixa AI
    </div>

    <div className="conv-last-message">
      Ask Anything...
    </div>
  </div>
</div>
              {conversation
                .filter((item) => {
                  return !item.members.some(
                    (member) =>
                      member._id !== ownId &&
                      member.name === "Unixa AI"
                  );
                })
                .map((item) => {
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
        {selectUserDetails ? 
          <Chats
            selectedId={selectedId}
            selectUserDetails={selectUserDetails}
            isAIChat={isAIChat}
          />
         : 
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
