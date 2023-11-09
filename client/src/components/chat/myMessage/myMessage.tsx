import { formatTimeFromISO } from "@/utils";
import style from "./myMessage.module.scss";

interface IMessageProps {
    nickname: string;
    message: string;
    time: string;
}

const MyMessage = (props: IMessageProps) => {
    const { nickname, message, time } = props;

    return (
        <div className={style.container}>
            <div className={style.avatar} />
            <div className={style.wrapper}>
                <span className={style.nickname}>{nickname}</span>
                <div className={style.message_wrapper}>
                    <div className={style.message_main}>{message}</div>
                    <span className={style.time}>{formatTimeFromISO(time)}</span>
                </div>
            </div>
        </div>
    );
};

export default MyMessage;
