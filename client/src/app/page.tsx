"use client";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/common/button/button";
import useModal from "@/components/modal/hooks/useModal";
import style from "./style.module.scss";
import { LANDING_CONTENTS } from "@/constants/landing.const";
import { motion, AnimatePresence } from "motion/react";

const Home = () => {
    const { onOpen } = useModal("login");

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
    const [currentIndex, setCurrentIndex] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout>();
    useEffect(() => {
        startCarousel();

        return () => {
            stopCarousel();
        };
    }, []);

    const startCarousel = () => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % LANDING_CONTENTS.length);
        }, 5000);
    };
    const stopCarousel = () => {
        clearInterval(intervalRef.current);
    };

    return (
        <div className={style.container}>
            <section className={`${style.landing_section}`}>
                <h2 className={style.landing_title}>실시간 소통과 맵 탐험을 한 번에 즐겨보세요.</h2>
                <Button type="button" look="solid" text="시작하기 →" width={143} onClick={onOpen} />
            </section>
            <section className={style.carousel_section}>
                <AnimatePresence mode="popLayout">
                    <div className={style.carousel_card_container}>
                        <motion.div
                            key={currentIndex}
                            className={style.carousel_card}
                            initial={{ opacity: 0.5, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0.5, y: -200 }}
                            transition={{
                                y: { type: "tween", duration: 0.8 },
                                opacity: { duration: 0.8 },
                            }}
                            onMouseOver={stopCarousel}
                            onMouseLeave={startCarousel}
                        >
                            {/* TODO: 여기 img로 수정 */}
                            <div className={style.carousel_image} />
                            <div className={style.carousel_text}>
                                <p className={style.carousel_text_title}>
                                    {LANDING_CONTENTS[currentIndex].title}
                                </p>
                                <p className={style.carousel_text_description}>
                                    {LANDING_CONTENTS[currentIndex].description}
                                </p>
                            </div>
                        </motion.div>
                        <ol className={style.carousel_navigator}>
                            {LANDING_CONTENTS.map((content, index) => {
                                return (
                                    <li
                                        className={`${style.carousel_navigator_item} ${
                                            currentIndex === index && style.active
                                        }`}
                                        onClick={() => setCurrentIndex(index)}
                                        key={index}
                                    />
                                );
                            })}
                        </ol>
                    </div>
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Home;
