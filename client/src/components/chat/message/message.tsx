import style from "./message.module.scss";

interface IMessageProps {
    nickname : string,
    message : string,
    time : string
}

const Message = (props : IMessageProps) => {

    const { nickname, message, time } = props;

    return (
        <div className={style.message_container}>
            <div className={style.avatar} />
            <div className={style.message_wrapper}>
                <div className={style.message_header}>
                    <span className={style.nickname}>
                        {nickname}
                    </span>
                    <span className={style.time}>
                        {time}
                    </span>
                </div>
                <div className={style.message_main}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default Message;
