import { Length, Matches } from "class-validator";
export class CreateRoomDto {
    @Length(1, 20, {
        message: "roomName의 글자수는 1-20자 입니다.",
    })
    @Matches(/^[\w\.\-가-힣ㄱ-ㅎㅏ-ㅣ]{1,20}$/, {
        message: "한글, 영문, 숫자, ., -, _만 가능합니다.",
    })
    readonly roomName: string;
}
