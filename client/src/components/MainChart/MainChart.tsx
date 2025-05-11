import style from './styles.module.scss';
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { formatTimeWithoutSeconds } from '@/utils/formatTimeWithoutSeconds';
import { roundToNearestFiveMinutes } from '@/utils/roundToNearestFiveMinutes';
import { roundToNearestHour } from '@/utils/roundToNearestHour';
import { roundToNearestThreeHours } from '@/utils/roundToNearestThreeHours';
import { fetchGameMode } from '@/utils/fetchGameMode';

interface MainChartProps {
    settingsStyle: {
        color: string,
        svg: string
    };
};

interface ServerStatus {
    time: string,
    onlinePlayers: number
};

interface GameModeStatus {
    [gameMode: string]: ServerStatus[]
};

const processOnlineData = (data: ServerStatus[], func: (time: string) => string, state: boolean, isAverage: boolean): ServerStatus[] => {
    if (!data || data.length === 0) return [];

    const timeGroups: { [key: string]: number[] } = {};

    data.forEach(item => {
        const roundedTime = func(item.time);
        if (!timeGroups[roundedTime]) {
            timeGroups[roundedTime] = [];
        }
        if (item.onlinePlayers && typeof item.onlinePlayers === 'number') {
            timeGroups[roundedTime].push(item.onlinePlayers);
        }
    });

    return Object.entries(timeGroups).map(([time, values]) => ({
        time: state ? formatTimeWithoutSeconds(time) : time,
        onlinePlayers: isAverage && values.length > 0
            ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
            : values.length > 0 ? Math.max(...values) : 0
    }));
};

const MainChart: React.FC<MainChartProps> = ({ settingsStyle }) => {
    const [CalcData, setCalcData] = useState<string>('avg');
    const [StatisticsPeriod, setStatisticsPeriod] = useState<string>('1D');
    const [WidthWindow, setWidthWindow] = useState<number>(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);
    const [DataGameMode, setDataGameMode] = useState<GameModeStatus>({});
    const [processedData, setProcessedData] = useState<ServerStatus[]>([]);
    const [PeakActivity, setPeakActivity] = useState<number>(0);
    const [Coordinates, setCoordinates] = useState<null | number>(null);
    const [DotTime, setDotTime] = useState('');
    const Ref = useRef(null);
    const [lastTooltipLabel, setLastTooltipLabel] = useState('');

    const WidthChart = (WidthWindow < 850 ? (WidthWindow < 750 ? (WidthWindow < 650 ? (WidthWindow < 550 ? (WidthWindow < 450 ? 358 : 408.5) : 508.5) : 609) : 709) : 800);

    const handleMouseMove = (event: React.MouseEvent) => {
        if (Ref.current) {
            const chartRect = event.currentTarget.getBoundingClientRect();
            const xPosition = event.clientX - chartRect.left;
            setCoordinates(xPosition);
        };
    };

    // Обновляем DotTime через эффект
    useEffect(() => {
        if (lastTooltipLabel) {
            setDotTime(lastTooltipLabel);
        }
    }, [lastTooltipLabel]);

    const CustomTooltip = useCallback(({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
        useEffect(() => {
            if (active && payload && payload.length && label) {
                setLastTooltipLabel(label);
            }
        }, [active, payload, label]);

        if (active && payload && payload.length) {
            return (
                <div className={style.container__custom_tooltip}>
                    <p>{`${payload[0].value} онлайн`}</p>
                </div>
            );
        }
        return null;
    }, []);

    useEffect(() => {
        fetchGameMode(setIsLoading, setDataGameMode, StatisticsPeriod, 'main', '');
        const interval = setInterval(() => {
            fetchGameMode(setIsLoading, setDataGameMode, StatisticsPeriod, 'main', '')
        }, 10000 * 6 * 5);

        return () => clearInterval(interval);
    }, [StatisticsPeriod]);

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
        if (DataGameMode && Object.keys(DataGameMode).length > 0) {
            const serverStatuses: ServerStatus[] = Object.values(DataGameMode).flatMap(statuses => statuses);

            if (StatisticsPeriod === '1D') {
                const processed = processOnlineData(serverStatuses, roundToNearestFiveMinutes, true, CalcData === 'avg');
                setProcessedData(processed);
            }
            else if (StatisticsPeriod === '7D') {
                const processed = processOnlineData(serverStatuses, roundToNearestHour, false, CalcData === 'avg');
                setProcessedData(processed);
            }
            else {
                const processed = processOnlineData(serverStatuses, roundToNearestThreeHours, false, CalcData === 'avg');
                setProcessedData(processed);
            }
        };
    }, [DataGameMode, CalcData]);

    useEffect(() => {
        if (processedData.length > 0) {
            const maxValue = processedData.reduce((max, curr) => {
                return curr.onlinePlayers > max ? curr.onlinePlayers : max;
            }, 0);
            setPeakActivity(maxValue);
        }
    }, [processedData]);

    const dynamicStyle = () => {
        if (!DotTime || !Coordinates) {
            return { display: 'none' };
        } else if (Coordinates < 8 && Coordinates > -5) {
            return { display: 'none' };
        } else {
            return { left: `${Coordinates}px`, display: 'block' };
        }
    };

    return (
        <div className={style.container}>
            <div className={style.container__box}>
                {!isLoading ? (
                    <div
                        ref={Ref}
                        onMouseMove={handleMouseMove}
                        onMouseOut={() => setCoordinates(null)}
                        style={{ overflow: 'hidden', borderRadius: '30px 0 30px 30px' }}
                    >
                        <ResponsiveContainer width={WidthChart} height={255}>
                            <AreaChart data={processedData}>
                                <XAxis hide={true} dataKey="time" />
                                <YAxis hide={true} />
                                <ReferenceLine
                                    y={processedData.length > 0 && processedData[processedData.length - 1]?.onlinePlayers !== undefined
                                        ? processedData[processedData.length - 1].onlinePlayers.toString()
                                        : "0"}
                                    stroke={settingsStyle.color}
                                    strokeDasharray="2 2"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <CartesianGrid opacity={0.2} strokeDasharray="2 2" />
                                <defs>
                                    <linearGradient id="gradientLinear" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={settingsStyle.color} stopOpacity={1} />
                                        <stop offset="95%" stopColor={settingsStyle.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="onlinePlayers"
                                    fill="url(#gradientLinear)"
                                    stroke={settingsStyle.color}
                                    strokeWidth={2.5}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className={style.loading}>Загрузка данных ...</div>
                )}
            </div>
            {!isLoading && (
                <>
                    <div className={style.dot_time} style={dynamicStyle()}>{DotTime}</div>
                    <div className={style.container__settings}>
                        <div className={style.settings__meaning}>
                            <button
                                onClick={() => setCalcData('avg')}
                                style={CalcData === 'avg' ? { color: settingsStyle.color } : {}}
                            >
                                AVG
                            </button>
                            <button
                                onClick={() => setCalcData('max')}
                                style={CalcData === 'max' ? { color: settingsStyle.color } : {}}
                            >
                                MAX
                            </button>
                        </div>
                        <div className={style.settings__time_gap}>
                            <button
                                onClick={() => setStatisticsPeriod('1D')}
                                style={StatisticsPeriod === '1D' ? { color: settingsStyle.color } : {}}
                            >
                                1D
                            </button>
                            <button
                                onClick={() => setStatisticsPeriod('7D')}
                                style={StatisticsPeriod === '7D' ? { color: settingsStyle.color } : {}}
                            >
                                7D
                            </button>
                            <button
                                onClick={() => setStatisticsPeriod('30D')}
                                style={StatisticsPeriod === '30D' ? { color: settingsStyle.color } : {}}
                            >
                                30D
                            </button>
                        </div>
                        <div className={style.settings__max}>{PeakActivity} пик</div>
                    </div>
                    <div
                        className={style.container__upload}
                        onClick={() => fetchGameMode(setIsLoading, setDataGameMode, StatisticsPeriod, 'main', '')}
                    />
                </>
            )}
        </div>
    );
};

export default MainChart;