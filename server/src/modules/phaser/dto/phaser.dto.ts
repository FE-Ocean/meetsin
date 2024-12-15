class MoveInfoDto {
    x : number;
    y : number;
    roomId : string;
    direction : string;
}

class StopPlayerInfoDto {
    roomId : string;
}

export { MoveInfoDto, StopPlayerInfoDto };