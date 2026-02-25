import React, { useState } from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import TaskDetailsModal from '@/components/server/schedules/TaskDetailsModal';

interface Props {
    schedule: Schedule;
}

export default ({ schedule }: Props) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TaskDetailsModal
                schedule={schedule}
                visible={visible}
                onModalDismissed={() => setVisible(false)}
            />

            <button
                onClick={() => setVisible(true)}
                className="
                    flex-1 sm:flex-none px-4 py-2 
                    rounded-lg border border-blue-400/40 
                    bg-[rgba(59,130,246,0.15)] backdrop-blur-md 
                    text-blue-300 font-semibold shadow-md 
                    transition transform hover:scale-105 
                    hover:border-blue-400 hover:text-blue-200 
                    disabled:opacity-50
                "
            >
                New Task
            </button>
        </>
    );
};
