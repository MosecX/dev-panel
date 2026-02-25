import React, { useState } from 'react';
import deleteSchedule from '@/api/server/schedules/deleteSchedule';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import { Dialog } from '@/components/elements/dialog';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

interface Props {
    scheduleId: number;
    onDeleted: () => void;
}

export default ({ scheduleId, onDeleted }: Props) => {
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const onDelete = () => {
        setIsLoading(true);
        clearFlashes('schedules');
        deleteSchedule(uuid, scheduleId)
            .then(() => {
                setIsLoading(false);
                onDeleted();
            })
            .catch((error) => {
                console.error(error);
                addError({ key: 'schedules', message: httpErrorToHuman(error) });
                setIsLoading(false);
                setVisible(false);
            });
    };

    return (
        <>
            <Dialog.Confirm
                open={visible}
                onClose={() => setVisible(false)}
                title={'Delete Schedule'}
                confirm={'Delete'}
                onConfirmed={onDelete}
            >
                <SpinnerOverlay visible={isLoading} />
                All tasks will be removed and any running processes will be terminated.
            </Dialog.Confirm>

            {/* Botón estilo PowerButtons */}
            <button
                className="
                    flex-1 sm:flex-none mr-4 
                    px-4 py-2 
                    rounded-lg border border-red-400/40 
                    bg-[rgba(239,68,68,0.15)] backdrop-blur-md 
                    text-red-300 font-semibold shadow-md 
                    transition transform hover:scale-105 
                    hover:border-red-400 hover:text-red-200 
                    disabled:opacity-50
                "
                onClick={() => setVisible(true)}
                disabled={isLoading}
            >
                Delete
            </button>
        </>
    );
};
