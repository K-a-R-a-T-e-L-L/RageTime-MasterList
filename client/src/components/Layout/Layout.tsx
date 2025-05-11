import { useEffect, useState } from 'react';
import style from './styles.module.scss';
import Header from '../Header/Header';
import Chart from '../Chart/Chart';
import { Settings } from './array';
import MainChart from '../MainChart/MainChart';
import Skeleton from '../Skeleton/Skeleton';
import { fetchGameMode } from '@/utils/fetchGameMode';

interface ServerStatus {
    time: string,
    onlinePlayers: number
};

interface GameModeStatus {
    [gameMode: string]: ServerStatus[]
};

const Layout = () => {
    const [gameModes, setGameModes] = useState<GameModeStatus>({});
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [WidthWindow, setWidthWindow] = useState<number>(window.innerWidth);
    const WidthSkeleton = (WidthWindow < 850 ? (WidthWindow < 750 ? (WidthWindow < 650 ? (WidthWindow < 550 ? (WidthWindow < 450 ? 358 : 408.5) : 508.5) : 609) : 709) : 800);

    const handleCount = (count: number) => {
        setTotalPlayers(count);
    };

    useEffect(() => {
        const handleResize = () => {
            setWidthWindow(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        fetchGameMode(setIsLoading, setGameModes, '1D', 'layout', '');
        const interval = setInterval(() => {
            fetchGameMode(setIsLoading, setGameModes, '1D', 'layout', '')
        }, 10000 * 6 * 5);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <main className={style.main}>
                <Header handleCount={handleCount} />
                <div className={style.main__div}>
                    <div className={style.div__zone}>
                        {!isLoading && (
                            <>
                                <div className={style.zone__ru}>RU ZONE</div>
                                <span className={style.zone__users}>
                                    {totalPlayers} игроков
                                </span>
                            </>
                        )}
                    </div>
                </div>
                {!isLoading ? (
                    <>
                        <MainChart settingsStyle={Settings[0]} />
                        {Object.keys(gameModes).map((mode, i) => (
                            <Chart nameMode={mode} settingsStyle={Settings[i + 1]} id={i} key={i} />
                        ))}
                    </>
                ) : (
                    <Skeleton WidthSkeleton={WidthSkeleton} />
                )}
            </main>
        </>
    );
};

export default Layout;