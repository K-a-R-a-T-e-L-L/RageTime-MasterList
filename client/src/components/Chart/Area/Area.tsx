import style from './styles.module.scss';
import { AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, Area } from 'recharts';
import React, { useEffect, useState, useCallback } from 'react';
import { formatTimeWithoutSeconds } from '@/utils/formatTimeWithoutSeconds';
import { roundToNearestFiveMinutes } from '@/utils/roundToNearestFiveMinutes';
import { roundToNearestHour } from '@/utils/roundToNearestHour';
import { roundToNearestThreeHours } from '@/utils/roundToNearestThreeHours';
import { fetchGameMode } from '@/utils/fetchGameMode';

interface AreaChartChildProps {
    nameMode: string;
    settingsStyle: {
        color: string,
        svg: string
    };
    id: number;
    handleReceiveTotalPlayers: (count: number) => void;
    setDotTime: (time: string | null) => void;
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

const AreaChartChild: React.FC<AreaChartChildProps> = ({ nameMode, settingsStyle, id, handleReceiveTotalPlayers, setDotTime }) => {
    const [CalcData, setCalcData] = useState<string>('avg');
    const [StatisticsPeriod, setStatisticsPeriod] = useState<string>('1D');
    const [WidthWindow, setWidthWindow] = useState<number>(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);
    const [DataGameMode, setDataGameMode] = useState<GameModeStatus>({});
    const [processedData, setProcessedData] = useState<ServerStatus[]>([]);
    const [PeakActivity, setPeakActivity] = useState<number>(0);
    const [lastTooltipLabel, setLastTooltipLabel] = useState<string | null>(null);

    const ArrayDataGameMode = DataGameMode[nameMode] || [];

    const WidthChart = (WidthWindow < 850 ? (WidthWindow < 750 ? (WidthWindow < 650 ? (WidthWindow < 550 ? (WidthWindow < 450 ? 358 : 408.5) : 508.5) : 609) : 709) : 800);

    // Обновляем DotTime через эффект
    useEffect(() => {
        if (lastTooltipLabel !== null) {
            setDotTime(lastTooltipLabel);
        }
    }, [lastTooltipLabel, setDotTime]);

    const CustomTooltip = useCallback(({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
        useEffect(() => {
            if (active && payload && payload.length && label) {
                setLastTooltipLabel(label);
            }
        }, [active, payload, label]);

        if (active && payload && payload.length) {
            return (
                <div className={style.chart__custom_tooltip}>
                    <p>{`${payload[0].value} онлайн`}</p>
                </div>
            );
        }
        return null;
    }, []);

    useEffect(() => {
        fetchGameMode(setIsLoading, setDataGameMode, StatisticsPeriod, 'area', nameMode);
        const interval = setInterval(() => {
            fetchGameMode(setIsLoading, setDataGameMode, StatisticsPeriod, 'area', nameMode);
        }, 10000 * 6 * 5);

        return () => clearInterval(interval);
    }, [StatisticsPeriod, nameMode]);

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
        if (ArrayDataGameMode && ArrayDataGameMode.length > 0) {
            let processed: ServerStatus[] = [];

            if (StatisticsPeriod === '1D') {
                processed = processOnlineData(ArrayDataGameMode, roundToNearestFiveMinutes, true, CalcData === 'avg');
            }
            else if (StatisticsPeriod === '7D') {
                processed = processOnlineData(ArrayDataGameMode, roundToNearestHour, false, CalcData === 'avg');
            }
            else {
                processed = processOnlineData(ArrayDataGameMode, roundToNearestThreeHours, false, CalcData === 'avg');
            }

            setProcessedData(processed);

            const lastItem = ArrayDataGameMode[ArrayDataGameMode.length - 1];
            if (lastItem?.onlinePlayers !== undefined) {
                handleReceiveTotalPlayers(lastItem.onlinePlayers);
            }
        }
    }, [ArrayDataGameMode, CalcData, handleReceiveTotalPlayers, StatisticsPeriod]);

    useEffect(() => {
        if (processedData.length > 0) {
            const maxValue = processedData.reduce((max, curr) => {
                return curr.onlinePlayers > max ? curr.onlinePlayers : max;
            }, 0);
            setPeakActivity(maxValue);
        }
    }, [processedData]);

    return (
        <div className={style.chart__box}>
            {!isLoading ? (
                <>
                    <ResponsiveContainer width={WidthChart} height={164}>
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
                                <linearGradient id={`gradient${id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={settingsStyle.color} stopOpacity={1} />
                                    <stop offset="95%" stopColor={settingsStyle.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="onlinePlayers"
                                fill={`url(#gradient${id})`}
                                stroke={settingsStyle.color}
                                strokeWidth={2.5}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className={style.chart__settings} onMouseOver={() => setDotTime(null)}>
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
                        className={style.chart__upload}
                        onMouseOver={() => setDotTime(null)}
                        onClick={() => fetchGameMode(setIsLoading, setDataGameMode, StatisticsPeriod, 'area', nameMode)}
                    />
                </>
            ) : (
                <div className={style.loading}>Загрузка данных ...</div>
            )}
        </div>
    );
};

export default AreaChartChild;