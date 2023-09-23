import Message from "../message/message";
import MessageInput from "../message_input/message_input";
import style from "./chat.module.scss";

const Chat = () => {
    return (
        <div className={style.chat_container}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>Chat</span>
                <button className={style.close_button} />
            </div>
            <div className={style.chat_main}>
                <Message />
                <Message />
                <Message />
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
            </div>
        </div>
    )
};

export default Chat;