import React from 'react';
import { Transition } from '@headlessui/react';

type Duration = `duration-${number}`;

interface Props {
    as?: React.ElementType;
    duration?: Duration | [Duration, Duration];
    show: boolean;
    children: React.ReactNode;
}

export default ({ children, duration, ...props }: Props) => {
    const [enterDuration, exitDuration] = Array.isArray(duration)
        ? duration
        : !duration
        ? ['duration-200', 'duration-150']
        : [duration, duration];

    return (
        <Transition
            {...props}
            enter={`ease-out ${enterDuration}`}
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave={`ease-in ${exitDuration}`}
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-2"
        >
            {children}
        </Transition>
    );
};
