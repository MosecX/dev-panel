import React, { useEffect, useState } from 'react';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';

interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={`flex space-x-3 ${className || ''}`}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>

            {/* Start */}
            <Can action={'control.start'}>
                <button
                    className={`flex-1 px-4 py-2 rounded-lg border border-green-400/40 bg-[rgba(34,197,94,0.15)] backdrop-blur-md text-green-300 font-semibold shadow-md transition transform hover:scale-105 hover:border-green-400 hover:text-green-200 disabled:opacity-50`}
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    Start
                </button>
            </Can>

            {/* Restart */}
            <Can action={'control.restart'}>
                <button
                    className={`flex-1 px-4 py-2 rounded-lg border border-yellow-400/40 bg-[rgba(234,179,8,0.15)] backdrop-blur-md text-yellow-300 font-semibold shadow-md transition transform hover:scale-105 hover:border-yellow-400 hover:text-yellow-200 disabled:opacity-50`}
                    disabled={!status}
                    onClick={onButtonClick.bind(this, 'restart')}
                >
                    Restart
                </button>
            </Can>

            {/* Stop / Kill */}
            <Can action={'control.stop'}>
                <button
                    className={`flex-1 px-4 py-2 rounded-lg border border-red-400/40 bg-[rgba(239,68,68,0.15)] backdrop-blur-md text-red-300 font-semibold shadow-md transition transform hover:scale-105 hover:border-red-400 hover:text-red-200 disabled:opacity-50`}
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                >
                    {killable ? 'Kill' : 'Stop'}
                </button>
            </Can>
        </div>
    );
};
