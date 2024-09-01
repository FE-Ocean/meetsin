import LobbyHeader from "@/components/lobby/lobbyHeader/lobbyHeader";
import LobbyMain from "@/components/lobby/lobbyMain/lobbyMain";
import { QUERY_KEY } from "@/constants/queryKey.const";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getUserRooms } from "../api/repository/room.repository";
import { IRoomModel } from "@/types/room";
import { getToken } from "@/utils/getToken";

const Lobby = async () => {
    const queryClient = new QueryClient();

    const accessToken = getToken();

    const formatRoomsData = async () => {
        const res = (await getUserRooms(accessToken)) as IRoomModel[];
        return res.map((room) => ({
            id: room._id,
            roomName: room.room_name,
            admin: room.admin,
            createdAt: room.created_at,
            userIds: room.userIds,
        }));
    };

    await queryClient.prefetchQuery({
        queryKey: QUERY_KEY.rooms,
        queryFn: formatRoomsData,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LobbyHeader />
            <LobbyMain />
        </HydrationBoundary>
    );
};

export default Lobby;
