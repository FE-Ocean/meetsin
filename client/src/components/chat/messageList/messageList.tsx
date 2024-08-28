import { IMessage } from "@/types/chat";
import MyMessage from "../myMessage/myMessage";
import ReceivedMessage from "../receivedMessage/receivedMessage";
import style from "./messageList.module.scss";
import { userAtom } from "@/jotai/atom";
import { useAtomValue } from "jotai";

interface Props {
    messages: IMessage[];
}

const MessageList = (props: Props) => {
    const { messages } = props;

    const user = useAtomValue(userAtom);
    const isMyMessage = (nickname: string) => nickname === user?.userName;

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
