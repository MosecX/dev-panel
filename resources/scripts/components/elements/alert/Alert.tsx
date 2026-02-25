import { ExclamationIcon, ShieldExclamationIcon } from '@heroicons/react/outline';
import React from 'react';
import classNames from 'classnames';

interface AlertProps {
    type: 'warning' | 'danger';
    className?: string;
    children: React.ReactNode;
}

export default ({ type, className, children }: AlertProps) => {
    return (
        <div
            className={classNames(
                'flex items-center text-gray-200 rounded-xl shadow-md px-4 py-3 ' +
                'bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] transition-all duration-200 ease-in-out',
                {
                    ['border-red-500/70 bg-red-500/20']: type === 'danger',
                    ['border-yellow-500/70 bg-yellow-500/20']: type === 'warning',
                },
                className
            )}
        >
            {type === 'danger' ? (
                <ShieldExclamationIcon className={'w-6 h-6 text-red-400 mr-2'} />
            ) : (
                <ExclamationIcon className={'w-6 h-6 text-yellow-400 mr-2'} />
            )}
            <div className="flex-1">{children}</div>
        </div>
    );
};
