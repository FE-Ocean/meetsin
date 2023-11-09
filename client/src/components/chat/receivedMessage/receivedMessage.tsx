import { formatTimeFromISO } from "@/utils";
import style from "./receivedMessage.module.scss";

interface IMessageProps {
    message: string;
    time: string;
}

const ReceivedMessage = (props: IMessageProps) => {
    const { message, time } = props;

    return (
        <div className={style.container}>
            <div className={style.wrapper}>
                <div className={style.message_wrapper}>
                    <span className={style.time}>{formatTimeFromISO(time)}</span>
                    <div className={style.message_main}>{message}</div>
                </div>
            </div>
        </div>
    );
};

export default ReceivedMessage;
