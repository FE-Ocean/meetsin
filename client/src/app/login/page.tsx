"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const login = async (id: any, pw: any) => {
        const response = await fetch("http://localhost:8000/users/login", {
            method: "POST",
            body: JSON.stringify({
                user_id: id,
                password: pw,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();

        const { token, user_name } = json;

        localStorage.setItem("token", token);
        localStorage.setItem("user_name", user_name);

        router.push("/");
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const id = formData.get("id");
        const pw = formData.get("pw");

        login(id, pw);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="id" type="text" placeholder="아이디" />
            <input name="pw" type="password" placeholder="비밀번호" />
            <button type="submit">로그인</button>
        </form>
    );
}
