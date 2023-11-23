import style from "./button.module.scss";

interface IProps {
    type: "button" | "submit";
    onClick?: () => void;
    look: "solid" | "ghost";
    width: number;
    text: string;
}

const Button = ({ type, onClick, look, width, text }: IProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${style.common} ${style[look]}`}
            style={{
                width: `${width}px`,
            }}
        >
            {text}
        </button>
    );
};
export default Button;
