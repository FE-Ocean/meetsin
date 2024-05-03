export const QUERY_KEY = {
    user: ["auth", "user", "info"],
    rooms: ["rooms"],
    room: (roomId: string) => ["room", roomId],
};
