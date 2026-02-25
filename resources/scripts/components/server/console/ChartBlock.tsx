import React from 'react';
import classNames from 'classnames';
import styles from '@/components/server/console/style.module.css';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

export default ({ title, legend, children }: ChartBlockProps) => (
    <div
        className={classNames(
            styles.chart_container,
            'group rounded-xl shadow-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)] transition transform hover:scale-[1.02] hover:border-cyan-400/40'
        )}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
            <h3 className="font-header text-lg font-bold text-gray-200 transition-colors duration-200 group-hover:text-cyan-400">
                {title}
            </h3>
            {legend && <div className="text-sm flex items-center gap-2 text-gray-400">{legend}</div>}
        </div>

        {/* Chart content */}
        <div className="z-10 p-4">{children}</div>
    </div>
);
