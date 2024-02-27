export const IMAGE_SIZE_TYPE = {
    middle: 24, // user
    large: 84, // room
} as const;

export type IMAGE_SIZE_TYPE = typeof IMAGE_SIZE_TYPE [keyof typeof IMAGE_SIZE_TYPE]
