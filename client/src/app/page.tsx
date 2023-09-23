import Menu from "@/components/menu/menu";
import style from "./style.module.scss";
import Chat from "@/components/chat/chat";

const Home = () => {
    return (
        <main className={style.main}>
            <h1>home</h1>
            <Menu />
            <Chat />
        </main>
    );
};
export default Home;
