import React from 'react';
import classNames from 'classnames';

interface CodeProps {
    dark?: boolean | undefined;
    className?: string;
    children: React.ReactChild | React.ReactFragment | React.ReactPortal;
}

const Code = ({ dark, className, children }: CodeProps) => (
    <code
        className={classNames(
            'font-mono text-sm px-2 py-1 inline-block rounded-md shadow-md transition-all duration-200 ease-in-out',
            className,
            {
                // Modo claro premium
                'bg-[rgba(0,0,0,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] text-purple-300':
                    !dark,
                // Modo oscuro premium con gradiente
                'bg-gradient-to-r from-[rgba(15,23,42,0.85)] to-[rgba(30,41,59,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-cyan-300':
                    dark,
            }
        )}
    >
        {children}
    </code>
);

export default Code;
