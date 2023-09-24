import Menu from "@/components/menu/menu";
import style from "./style.module.scss";
import Chat from "@/components/chat/chat";

const Home = () => {
    return (
        <main className={style.main}>
            <div className={style.container}>
                {/* 임시로 화면공유 박스 만들어두겠습니다. 추후 삭제해주세요. */}
                <div style={{ backgroundColor : "gray", flexGrow : 1, marginRight : "26px" }} />
                <Chat className={style.chat} />
            </div>
            <Menu className={style.menu}/>
        </main>
    );
};
export default Home;
