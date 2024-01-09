import { IMessage } from "@/types/chat";
import MyMessage from "../myMessage/myMessage";
import ReceivedMessage from "../receivedMessage/receivedMessage";
import style from "./messageList.module.scss";

interface Props {
    messages: IMessage[];
}

const MessageList = (props: Props) => {
    const { messages } = props;

    const isMyMessage = (nickname: string) => nickname === "me";

    return (
        <ul className={style.messsage_list}>
            {messages.map((message, index) => {
                return isMyMessage(message.nickname) ? (
                    <MyMessage key={index} message={message.message} time={message.time} />
                ) : (
                    <ReceivedMessage
                        key={index}
                        message={message.message}
                        time={message.time}
                        nickname={message.nickname}
                    />
                );
            })}
        </ul>
    );
};

export default MessageList;
