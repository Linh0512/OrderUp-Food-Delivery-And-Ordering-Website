import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ChatPage() {
  const [chatActive, setChatActive] = useState();
  const chatItems = [
    {
      id: "ORDER UP",
      name: "ORDER UP",
      avatar: "https://placehold.co/40x40/FF6347/FFFFFF?text=OU",
      lastMessage: "Xin chào , tôi có thể giúp gì cho ...",
      time: "4 phút",
    },
    {
      id: "CƠM NGÔ QUYỀN",
      name: "CƠM NGÔ QUYỀN",
      avatar: "https://placehold.co/40x40/32CD32/FFFFFF?text=CNQ",
      lastMessage: "Xin chào , tôi có thể giúp gì cho ...",
      time: "6 phút",
    },
    {
      id: "NGÔ GIA",
      name: "NGÔ GIA",
      avatar: "https://placehold.co/40x40/8A2BE2/FFFFFF?text=NG",
      lastMessage: "Xin chào , tôi có thể giúp gì cho .....",
      time: "6 phút",
    },
    {
      id: "HONOR OF KINGS",
      name: "HONOR OF KINGS",
      avatar: "https://placehold.co/40x40/FFD700/000000?text=HOK",
      lastMessage: "Xin chào , tôi có thể giúp gì cho .....",
      time: "4 phút",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "other",
      name: "Order Up",
      avatar: "https://placehold.co/32x32/FF6347/FFFFFF?text=OU",
      timestamp: "17:05 pm",
      text: "Xin chào , cảm ơn bạn đã liên hệ với chúng tôi . Chúng tôi đã nhận được tin nhắn của bạn và sẽ sớm trả lời",
    },
    {
      id: 2,
      sender: "me",
      timestamp: "17:04 pm",
      text: "Xin chào , tôi muốn hỏi cách đăng ký tài khoản .",
    },
    {
      id: 3,
      sender: "me",
      timestamp: "17:06 pm",
      text: "Tôi muốn hỏi cách đăng ký tài khoản .",
    },
    {
      id: 4,
      sender: "other",
      name: "Order Up",
      avatar: "https://placehold.co/32x32/FF6347/FFFFFF?text=OU",
      timestamp: "17:06 pm",
      text: "Xin chào , tôi có thể giúp gì cho bạn ?",
    },
  ];

  const InfoIcon = ({ className }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );

  const SendIcon = ({ className }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
  );
  return (
    <div className="w-[80vw] mx-auto flex space-x-10">
      <div className="w-[30%]">
        <h2 className="dancing-script-700 text-4xl">Đoạn chat</h2>
        <div className="flex items-center space-x-3 mt-4 px-2 rounded-lg bg-white shadow ">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Tìm kiếm thông tin đoạn chat..."
            className="w-full py-2 focus:outline-none "
          />
        </div>
        <div className="space-y-4 mt-5">
          {chatItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center p-4 border space-x-4 ${
                item.id === chatActive?.id
                  ? "bg-blue-100"
                  : "bg-white hover:bg-gray-100"
              } rounded-2xl shadow  transition`}
              onClick={() => setChatActive(item)}
            >
              <img src={item.avatar} alt="" className="rounded-full size-13" />
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xl">{item.name}</p>
                  <p className="opacity-50">{item.time}</p>
                </div>
                <p className="text-sm">{item.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[65%]">
        {/* Phần header chat */}
        {chatActive ? (<div className="flex justify-between items-center bg-blue-100 p-4 rounded-t-2xl">
          <div className="flex space-x-3">
            <img
              src={chatActive.avatar}
              alt=""
              className="rounded-full size-13"
            />
            <div className="flex justify-center flex-col ">
              <p className="font-bold text-xl">{chatActive.name}</p>
              <p className="opacity-50">{chatActive.time}</p>
            </div>
          </div>
          <InfoIcon className="w-6 h-6 cursor-pointer hover:text-blue-500" />
        </div>):(<div className="flex justify-end bg-blue-100 p-4 rounded-t-2xl">
            <InfoIcon className="w-6 h-6 cursor-pointer hover:text-blue-500 " />
        </div>)}
        {/* Phần chứa message */}
        {chatActive ? (
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white h-[60vh]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "other" && message.avatar && (
                  <img
                    src={message.avatar}
                    alt={`${message.name} Avatar`}
                    className="w-8 h-8 rounded-full mr-3 self-end"
                  />
                )}
                <div
                  className={`
                  max-w-[70%] p-3 rounded-xl shadow
                  ${
                    message.sender === "me"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }
                `}
                >
                  <p>{message.text}</p>
                  <span
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-blue-200"
                        : "text-gray-500"
                    } block text-right`}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white h-[60vh]"></div>
        )}
        {/* Phần gửi tin nhắn */}
        <div className="flex bg-blue-100 items-center p-4 space-x-3 rounded-b-2xl">
          <input
            type="text"
            placeholder="nhập tin nhắn ở đây..."
            className="w-full p-2 bg-white rounded-xl outline-none "
          />
          <SendIcon className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700" />
        </div>
      </div>
    </div>
  );
}
