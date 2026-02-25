import classNames from 'classnames';
import styles from '@/components/elements/dropdown/style.module.css';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Menu } from '@headlessui/react';
import React from 'react';

interface Props {
    className?: string;
    animate?: boolean;
    children: React.ReactNode;
}

export default ({ className, animate = true, children }: Props) => (
    <Menu.Button
        className={classNames(
            styles.button,
            className || 'px-4',
            'inline-flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out',
            'bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-gray-200 shadow-md',
            'hover:text-cyan-300 hover:border-cyan-400 active:scale-[0.97]'
        )}
    >
        {typeof children === 'string' ? (
            <>
                <span className={'mr-2'}>{children}</span>
                <ChevronDownIcon
                    aria-hidden={'true'}
                    data-animated={animate.toString()}
                    className="w-5 h-5 text-gray-400 group-hover:text-cyan-300 transition-colors duration-200 ease-in-out"
                />
            </>
        ) : (
            children
        )}
    </Menu.Button>
);
