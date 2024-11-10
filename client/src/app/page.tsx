"use client";
import { useEffect, useState, useCallback } from "react";
import Button from "@/components/common/button/button";
import useModal from "@/hooks/useModal";
import style from "./style.module.scss";

const Home = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const totalSections = 3;
    const { onOpen } = useModal("login");

    const throttleScroll = useCallback((callback: () => void, delay: number) => {
        if (isScrolling) return;
        
        setIsScrolling(true);
        callback();
        
        setTimeout(() => {
            setIsScrolling(false);
        }, delay);
    }, [isScrolling]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            throttleScroll(() => {
                if (e.deltaY > 0 && currentSection < totalSections - 1) {
                    setCurrentSection(prev => prev + 1);
                } else if (e.deltaY < 0 && currentSection > 0) {
                    setCurrentSection(prev => prev - 1);
                }
            }, 1000); // 1초 딜레이
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [currentSection, throttleScroll]);

    useEffect(() => {
        const registerServiceWorker = async () => {
            if (!("serviceWorker" in navigator)) {
                alert("이 브라우저는 서비스 워커 제공 X");
                return;
            }

            await navigator.serviceWorker.register("/serviceWorker.js");
        };
        registerServiceWorker();
    }, []);

    return (
        <div className={style.container}>
            <div 
                className={style.landing_wrapper}
                style={{ 
                    transform: `translateY(-${currentSection * 100}vh)`,
                    transition: "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000)"
                }}
            >
                <section 
                    className={`
                        ${style.landing_section} 
                        ${currentSection === 0 ? style.active : ""}
                    `}
                >
                    <h2 className={style.landing_title}>실시간 소통과 맵 탐험을 한 번에 즐겨보세요.
                    </h2>
                    <Button type="button" look="solid" text="시작하기" width={143} onClick={onOpen} />
                </section>
                
                <section className={`${style.landing_section} ${currentSection === 1 ? style.active : ""}`}>
                    <div className={style.landing_content}>
                        <div className={style.landing_image}>이미지</div>
                        <p className={style.landing_description}>phaser 맵 설명</p>
                    </div>
                </section>

                <section className={`${style.landing_section} ${currentSection === 2 ? style.active : ""}`}>
                    <div className={style.landing_content}>
                        <div className={style.landing_image}>이미지</div>
                        <p className={style.landing_description}>화면공유 설명</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
