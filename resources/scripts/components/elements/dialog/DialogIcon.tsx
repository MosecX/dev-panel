import React, { useContext, useEffect } from 'react';
import {
    CheckIcon,
    ExclamationIcon,
    InformationCircleIcon,
    ShieldExclamationIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import { DialogContext, DialogIconProps, styles } from './';

const icons = {
    danger: ShieldExclamationIcon,
    warning: ExclamationIcon,
    success: CheckIcon,
    info: InformationCircleIcon,
};

export default ({ type, position, className }: DialogIconProps) => {
    const { setIcon, setIconPosition } = useContext(DialogContext);

    useEffect(() => {
        const Icon = icons[type];

        setIcon(
            <div
                className={classNames(
                    styles.dialog_icon,
                    styles[type],
                    className,
                    'flex items-center justify-center w-10 h-10 rounded-lg shadow-md',
                    'bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]'
                )}
            >
                <Icon
                    className={classNames('w-6 h-6', {
                        'text-red-400': type === 'danger',
                        'text-yellow-400': type === 'warning',
                        'text-green-400': type === 'success',
                        'text-cyan-400': type === 'info',
                    })}
                />
            </div>
        );
    }, [type, className]);

    useEffect(() => {
        setIconPosition(position);
    }, [position]);

    return null;
};
