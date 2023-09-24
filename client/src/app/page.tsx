import Menu from "@/components/menu/menu";
import style from "./style.module.scss";
import Chat from "@/components/chat/chat";
import ModalTestComponent from "@/components/test/test";

const Home = () => {
    return (
        <main className={style.main}>
            <div className={style.container}>
                {/* 임시로 화면공유 박스 만들어두겠습니다. 추후 삭제해주세요. */}
                <div style={{ backgroundColor : "gray", flexGrow : 1, marginRight : "26px" }} />
                {/* 모달 생성 버튼 예시입니다. 추후 삭제해주세요. */}
                <ModalTestComponent />
                <Chat className={style.chat} />
            </div>
            <Menu className={style.menu}/>
        </main>
    );
};
export default Home;
