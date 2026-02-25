import React, { forwardRef } from 'react';
import { Menu } from '@headlessui/react';
import styles from './style.module.css';
import classNames from 'classnames';

interface Props {
    children: React.ReactNode | ((opts: { active: boolean; disabled: boolean }) => JSX.Element);
    danger?: boolean;
    disabled?: boolean;
    className?: string;
    icon?: JSX.Element;
    onClick?: (e: React.MouseEvent) => void;
}

const DropdownItem = forwardRef<HTMLAnchorElement, Props>(
    ({ disabled, danger, className, onClick, children, icon: IconComponent }, ref) => {
        return (
            <Menu.Item disabled={disabled}>
                {({ disabled, active }) => (
                    <a
                        ref={ref}
                        href={'#'}
                        className={classNames(
                            styles.menu_item,
                            {
                                [styles.danger]: danger,
                                [styles.disabled]: disabled,
                            },
                            className,
                            'flex items-center px-3 py-2 rounded-md transition-all duration-200 ease-in-out',
                            'bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-gray-200',
                            {
                                'hover:bg-cyan-600/30 hover:text-cyan-300': !danger && !disabled,
                                'hover:bg-red-600/30 hover:text-red-300': danger && !disabled,
                                'opacity-50 cursor-not-allowed': disabled,
                                'ring-2 ring-cyan-400/50': active && !disabled && !danger,
                                'ring-2 ring-red-400/50': active && danger && !disabled,
                            }
                        )}
                        onClick={onClick}
                    >
                        {IconComponent && <span className="mr-2">{IconComponent}</span>}
                        {typeof children === 'function' ? children({ disabled, active }) : children}
                    </a>
                )}
            </Menu.Item>
        );
    }
);

export default DropdownItem;
