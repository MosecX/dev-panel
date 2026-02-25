import React, { useCallback, useState } from 'react';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import triggerScheduleExecution from '@/api/server/schedules/triggerScheduleExecution';
import { ServerContext } from '@/state/server';
import useFlash from '@/plugins/useFlash';
import { Schedule } from '@/api/server/schedules/getServerSchedules';

const RunScheduleButton = ({ schedule }: { schedule: Schedule }) => {
    const [loading, setLoading] = useState(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const appendSchedule = ServerContext.useStoreActions((actions) => actions.schedules.appendSchedule);

    const onTriggerExecute = useCallback(() => {
        clearFlashes('schedule');
        setLoading(true);
        triggerScheduleExecution(id, schedule.id)
            .then(() => {
                setLoading(false);
                appendSchedule({ ...schedule, isProcessing: true });
            })
            .catch((error) => {
                console.error(error);
                clearAndAddHttpError({ error, key: 'schedules' });
            })
            .finally(() => setLoading(false));
    }, [id, schedule, appendSchedule, clearFlashes, clearAndAddHttpError]);

    return (
        <>
            <SpinnerOverlay visible={loading} size={'large'} />
            <button
                onClick={onTriggerExecute}
                disabled={schedule.isProcessing}
                className="
                    flex-1 sm:flex-none px-4 py-2 
                    rounded-lg border border-indigo-400/40 
                    bg-[rgba(99,102,241,0.15)] backdrop-blur-md 
                    text-indigo-300 font-semibold shadow-md 
                    transition transform hover:scale-105 
                    hover:border-indigo-400 hover:text-indigo-200 
                    disabled:opacity-50
                "
            >
                Run Now
            </button>
        </>
    );
};

export default RunScheduleButton;
