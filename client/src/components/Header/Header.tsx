import { useState, useEffect } from 'react';
import style from './styles.module.scss';
import { fetchGameMode } from '@/utils/fetchGameMode';

interface ServerStatus {
    time: string,
    onlinePlayers: number
};

interface GameModeStatus {
    [gameMode: string]: ServerStatus[]
};

const Header = ({ handleCount }: { handleCount: (count: number) => void }) => {
    const [gameModesPlayers, setGameModesPlayers] = useState<GameModeStatus>({});
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [AnimationCount, setAnimationCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const total = () => {
            let sum = 0;
            Object.values(gameModesPlayers).forEach(modeData => {
                if (modeData.length > 0) {
                    sum += modeData[modeData.length - 1].onlinePlayers;
                }
            });
            setTotalPlayers(sum);
        };

        total();
    }, [gameModesPlayers]);

    useEffect(() => {
        fetchGameMode(setIsLoading, setGameModesPlayers, '1D', 'layout', '');
        const interval = setInterval(() => {
            fetchGameMode(setIsLoading, setGameModesPlayers, '1D', 'layout', '')
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (totalPlayers > 0) {
            const duration = 1000;
            const stepTime = Math.abs(Math.floor(duration / totalPlayers));
            let current = 0;

            const animate = setInterval(() => {
                if (current < totalPlayers) {
                    current += 1;
                    setAnimationCount(current);
                } else {
                    clearInterval(animate);
                }
            }, stepTime);

            return () => clearInterval(animate);
        } else {
            setAnimationCount(0);
        }
    }, [totalPlayers]);

    useEffect(() => {
        handleCount(AnimationCount);
    }, [AnimationCount]);

    return (
        <>
            <header className={style.header}>
                <h1 className={style.header__h1}>MASTERLIST</h1>
                <span className={style.header__span}>{isLoading ? '' : `${AnimationCount} игроков`}</span>
            </header>
        </>
    );
};

export default Header;