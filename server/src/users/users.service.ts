import { Injectable } from "@nestjs/common";
import { UserDto, UserEntity } from "src/schema/user.schema";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    entityToDto(user: UserEntity) {
        const userDto = new UserDto();
        userDto.id = user._id;
        userDto.email = user.email;
        userDto.user_name = user.user_name;
        userDto.profile_img = user.profile_img;
        userDto.character = user.character;
        userDto.provider = user.provider;
        return userDto;
    }
}
