import React, { useContext } from 'react';
import { DialogContext } from './';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';

export default ({ children }: { children: React.ReactNode }) => {
    const { setFooter } = useContext(DialogContext);

    useDeepCompareEffect(() => {
        setFooter(
            <div
                className={
                    'px-6 py-3 flex items-center justify-end space-x-3 rounded-b ' +
                    'bg-[rgba(0,0,0,0.6)] backdrop-blur-md border-t border-[rgba(255,255,255,0.08)] text-gray-200 shadow-inner'
                }
            >
                {children}
            </div>
        );
    }, [children]);

    return null;
};
