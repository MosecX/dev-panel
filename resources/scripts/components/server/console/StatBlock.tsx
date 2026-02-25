import React from 'react';
import Icon from '@/components/elements/Icon';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './style.module.css';
import useFitText from 'use-fit-text';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface StatBlockProps {
    title: string;
    copyOnClick?: string;
    color?: string | undefined;
    icon: IconDefinition;
    children: React.ReactNode;
    className?: string;
}

export default ({ title, copyOnClick, icon, color, className, children }: StatBlockProps) => {
    const { fontSize, ref } = useFitText({ minFontSize: 8, maxFontSize: 500 });

    return (
        <CopyOnClick text={copyOnClick}>
            <div
                className={classNames(
                    styles.stat_block,
                    'relative flex items-center gap-4 p-4 rounded-xl shadow-lg',
                    'border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-md',
                    'transition-transform duration-300 hover:scale-[1.02] hover:border-cyan-400/40',
                    className
                )}
            >
                {/* Barra lateral decorativa */}
                <div
                    className={classNames(
                        styles.status_bar,
                        color || 'bg-cyan-700',
                        'absolute left-0 top-0 h-full w-1 rounded-l-xl',
                        'shadow-[0_0_10px_rgba(0,255,255,0.4)] transition-all duration-500'
                    )}
                />

                {/* Contenido */}
                <div className="flex flex-col justify-center overflow-hidden w-full">
                    <p className="font-header font-medium leading-tight text-xs md:text-sm text-gray-400">
                        {title}
                    </p>
                    <div
                        ref={ref}
                        className="h-[1.75rem] w-full font-semibold truncate transition-colors duration-300 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-emerald-400"
                        style={{ fontSize }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </CopyOnClick>
    );
};
