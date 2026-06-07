import  { useEffect, useState } from 'react'
import "./conversation.css"
export const Conversation = (props) => {

const [friendItem,setFriendItem] =useState([])

useEffect(()=>{
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const ownId = userInfo?._id;
  const friendItem = props.members.filter((item)=>item._id !== ownId);
  setFriendItem(friendItem);
}, [props.members]);


const handleOnClick=()=>{
  props.handleSelectedUser(props.id, friendItem)

}

  return (
    <div>
        <div className={`conv ${props.active?"active-class":null}` }onClick={handleOnClick}>
                            <div className="conv-profile-img">
                                <img className='profile-img-conv' src={friendItem[0]?.profilePic}></img>
                            </div>
                            <div className="conv-name">
                                <div className="conv-profile-name">{friendItem[0]?.name}</div>
                                <div className="conv-last-message">{friendItem[0]?.mobileNumber}</div>
                            </div>
                            
                        </div>
    </div>
  )
}

export default Conversation;