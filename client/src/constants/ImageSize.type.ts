export const imageSizeType = {
    middle: 24, // user
    large: 84, // room
};

export type imageSizeType = keyof (typeof imageSizeType)[];
