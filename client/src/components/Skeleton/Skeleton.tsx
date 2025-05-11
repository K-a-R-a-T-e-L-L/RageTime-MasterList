import React from 'react';
import style from './styles.module.scss';

interface SkeletonProps {
    WidthSkeleton: number
};

const Skeleton: React.FC<SkeletonProps> = ({WidthSkeleton}) => {
    return (
        <>
            <div className={`${style.loader} ${style.loader_main}`} style={{ width: WidthSkeleton }}>
                <div className={style.loader_main__one}></div>
                <div className={style.loader_main__two}></div>
                <div className={style.loader_main__three}></div>
                <div className={style.loader_main__four}></div>
            </div>
            <div className={style.loader} style={{ width: WidthSkeleton }}>
                <div className={style.loader__one}></div>
                <div className={style.loader__two}></div>
                <div className={style.loader__three}></div>
            </div>
            <div className={style.loader} style={{ width: WidthSkeleton }}>
                <div className={style.loader__one}></div>
                <div className={style.loader__two}></div>
                <div className={style.loader__three}></div>
            </div>
            <div className={style.loader} style={{ width: WidthSkeleton }}>
                <div className={style.loader__one}></div>
                <div className={style.loader__two}></div>
                <div className={style.loader__three}></div>
            </div>
            <div className={style.loader} style={{ width: WidthSkeleton }}>
                <div className={style.loader__one}></div>
                <div className={style.loader__two}></div>
                <div className={style.loader__three}></div>
            </div>
            <div className={style.loader} style={{ width: WidthSkeleton }}>
                <div className={style.loader__one}></div>
                <div className={style.loader__two}></div>
                <div className={style.loader__three}></div>
            </div>
        </>
    );
};

export default Skeleton;