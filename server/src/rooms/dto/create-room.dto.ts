import { IsString, Length, Matches } from "class-validator";
export class CreateRoomDto {
    @Length(1, 10, {
        message: "roomName의 글자수는 1-10자 입니다.",
    })
    @Matches(/^[\w\.\-가-힣ㄱ-ㅎㅏ-ㅣ]$/, {
        message: "한글, 영문, 숫자, ., -, _만 가능합니다.",
    })
    readonly roomName: string;
}
