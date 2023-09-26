import style from "./timerSetting.module.scss";

const TimerSetting = () => {
    return (
        <div className={style.modal_container}>
            <button className={style.close_icon} />
            <h2 className={style.title}>Timer Setting</h2>
            <div className={style.time_section}>
                <span className={style.placeholder}>88:88</span>
                <div className={style.inputs}>
                    <input className={style.minute} type="text" maxLength={2} />
                    :
                    <input className={style.second} type="text" maxLength={2} />
                </div>
            </div>
            <div className={style.buttons}>
                <button type="button" className={style.close}>
                    CLOSE
                </button>
                <button type="submit" className={style.start}>
                    START
                </button>
            </div>
        </div>
    );
};
export default TimerSetting;
