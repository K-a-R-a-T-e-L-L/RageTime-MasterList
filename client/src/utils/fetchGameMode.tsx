import { apiClient } from "@/api/client";

interface ServerStatus {
    time: string;
    onlinePlayers: number;
};

interface GameModeStatus {
    [gameMode: string]: ServerStatus[];
};

interface ServerStatusResponse extends ServerStatus {
    gameMode?: string;
}

export const fetchGameMode = async (
    setLoad: (load: boolean) => void,
    setDataModes: (data: GameModeStatus) => void,
    period: string,
    typeRequest: string,
    nameMode: string
) => {
    try {
        setLoad(true);
        const response = await apiClient.get<ServerStatusResponse[]>(`/api/servers/status/${period === '1D' ? '1D' : '7D_30D'}`);

        if (typeRequest === 'main') {
            const formattedData = response.data.reduce((acc: Record<string, ServerStatus>, item) => {
                if (!acc[item.time]) {
                    acc[item.time] = { time: item.time, onlinePlayers: 0 };
                }
                acc[item.time].onlinePlayers += item.onlinePlayers;
                return acc;
            }, {});

            const dataGameMode = Object.values(formattedData);
            setDataModes({ main: dataGameMode }); // Преобразуем в GameModeStatus
        }
        else {
            const formattedData = response.data.reduce((acc: GameModeStatus, item) => {
                if (!item.gameMode) return acc;
                
                if (!acc[item.gameMode]) {
                    acc[item.gameMode] = [];
                }

                acc[item.gameMode].push({
                    time: item.time,
                    onlinePlayers: item.onlinePlayers,
                });

                return acc;
            }, {} as GameModeStatus);

            if (typeRequest === 'area') {
                setDataModes({ [nameMode]: formattedData[nameMode] || [] });
            } else {
                setDataModes(formattedData);
            }
        }

    } catch (error) {
        console.error('Ошибка при загрузке статуса серверов:', error);
    } finally {
        setLoad(false);
    }
};