import AreaChartChild from './Area/Area';
import style from './styles.module.scss';
import React, { useEffect, useRef, useState } from 'react';

interface ChartProps {
    nameMode: string;
    id: number;
    settingsStyle: {
        color: string,
        svg: string
    };
}

const Chart: React.FC<ChartProps> = ({ nameMode, id, settingsStyle }) => {
    const [OpenChart, setOpenChart] = useState<boolean>(false);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [AnimationCount, setAnimationCount] = useState(0);
    const [Coordinates, setCoordinates] = useState<null | number>(null);
    const [DotTime, setDotTime] = useState<string | null>(null); // Изменено на string | null
    const Ref = useRef(null);

    const handleMouseMove = (event: React.MouseEvent) => {
        if (Ref.current) {
            const chartRect = event.currentTarget.getBoundingClientRect();
            const xPosition = event.clientX - chartRect.left;
            setCoordinates(xPosition);
        };
    };

    const handleReceiveTotalPlayers = (count: number) => {
        setTotalPlayers(count);
    };

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

    const dynamicStyle = () => {
        if (!DotTime || !Coordinates) {
            return { display: 'none' };
        } else if (Coordinates < 8 && Coordinates > 0) {
            return { display: 'none' };
        } else {
            return { left: `${Coordinates}px`, display: 'block' };
        }
    };

    return (
        <div className={style.container}>
            <div 
                className={style.box} 
                onClick={() => setOpenChart(!OpenChart)} 
                style={OpenChart ? { borderRadius: '20px 20px 0 0' } : { borderRadius: '20px' }}
            >
                <div className={style.box__top}>
                    <div className={style.top__region}>
                        <div></div>
                        <div>{nameMode}</div>
                    </div>
                    <div className={style.top__count}>{AnimationCount}</div>
                </div>
                <div className={style.box__bottom}>
                    <div className={style.bottom__title}>
                        {OpenChart ? 'Скрыть' : 'Показать'} график онлайна <span></span>
                    </div>
                    <div className={style.bottom__users}>ИГРОКОВ</div>
                </div>
                <div 
                    className={style.box__svg_backg_one} 
                    style={{ backgroundImage: `url(${settingsStyle.svg})` }} 
                />
                <div 
                    className={style.box__svg_backg_two} 
                    style={{ backgroundImage: `url(${settingsStyle.svg})` }} 
                />
                <div 
                    className={style.box__svg_backg_three} 
                    style={{ backgroundImage: `url(${settingsStyle.svg})` }} 
                />
            </div>
            <div className={style.chart} style={OpenChart ? { display: 'block' } : { display: 'none' }}>
                <div 
                    ref={Ref} 
                    onMouseMove={handleMouseMove} 
                    onMouseOut={() => setCoordinates(null)}
                >
                    <AreaChartChild 
                        nameMode={nameMode} 
                        settingsStyle={settingsStyle} 
                        id={id} 
                        handleReceiveTotalPlayers={handleReceiveTotalPlayers} 
                        setDotTime={setDotTime} 
                    />
                </div>
                {DotTime && (
                    <div 
                        onMouseOut={() => setCoordinates(null)} 
                        className={style.dot_time} 
                        style={dynamicStyle()}
                    >
                        {DotTime}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chart;