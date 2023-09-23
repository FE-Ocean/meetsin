import style from "./message.module.scss";

const Message = () => {
    return (
        <div className={style.message_container}>
            <div className={style.avatar} />
            <div className={style.message_wrapper}>
                <div className={style.message_header}>
                    <span className={style.nickname}>
                        유저닉네임
                    </span>
                    <span className={style.time}>
                        23:33
                    </span>
                </div>
                <div className={style.message_main}>
                    채팅내용
                </div>
            </div>
        </div>
    )
};

export default Message;
