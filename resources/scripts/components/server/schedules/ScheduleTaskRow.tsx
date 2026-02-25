import React, { useState } from 'react';
import { Schedule, Task } from '@/api/server/schedules/getServerSchedules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowCircleDown,
    faClock,
    faCode,
    faFileArchive,
    faPencilAlt,
    faToggleOn,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import deleteScheduleTask from '@/api/server/schedules/deleteScheduleTask';
import { httpErrorToHuman } from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import TaskDetailsModal from '@/components/server/schedules/TaskDetailsModal';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import tw from 'twin.macro';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import Icon from '@/components/elements/Icon';

interface Props {
    schedule: Schedule;
    task: Task;
}

const getActionDetails = (action: string): [string, any] => {
    switch (action) {
        case 'command':
            return ['Send Command', faCode];
        case 'power':
            return ['Send Power Action', faToggleOn];
        case 'backup':
            return ['Create Backup', faFileArchive];
        default:
            return ['Unknown Action', faCode];
    }
};

export default ({ schedule, task }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { clearFlashes, addError } = useFlash();
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const appendSchedule = ServerContext.useStoreActions((actions) => actions.schedules.appendSchedule);

    const onConfirmDeletion = () => {
        setIsLoading(true);
        clearFlashes('schedules');
        deleteScheduleTask(uuid, schedule.id, task.id)
            .then(() =>
                appendSchedule({
                    ...schedule,
                    tasks: schedule.tasks.filter((t) => t.id !== task.id),
                })
            )
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                addError({ message: httpErrorToHuman(error), key: 'schedules' });
            });
    };

    const [title, icon] = getActionDetails(task.action);

    return (
        <div
            css={tw`
                sm:flex items-center p-4 sm:p-6 
                border-b border-[rgba(255,255,255,0.08)] 
                bg-[rgba(255,255,255,0.03)] backdrop-blur-md 
                transition hover:scale-[1.01]
            `}
        >
            <SpinnerOverlay visible={isLoading} fixed size={'large'} />
            <TaskDetailsModal
                schedule={schedule}
                task={task}
                visible={isEditing}
                onModalDismissed={() => setIsEditing(false)}
            />
            <ConfirmationModal
                title={'Confirm task deletion'}
                buttonText={'Delete Task'}
                onConfirmed={onConfirmDeletion}
                visible={visible}
                onModalDismissed={() => setVisible(false)}
            >
                Are you sure you want to delete this task? This action cannot be undone.
            </ConfirmationModal>

            {/* Icon */}
            <FontAwesomeIcon icon={icon} css={tw`text-lg text-blue-300 hidden md:block`} />

            {/* Task details */}
            <div css={tw`flex-none sm:flex-1 w-full sm:w-auto overflow-x-auto`}>
                <p css={tw`md:ml-6 text-neutral-100 uppercase text-sm font-semibold`}>{title}</p>
                {task.payload && (
                    <div css={tw`md:ml-6 mt-2`}>
                        {task.action === 'backup' && (
                            <p css={tw`text-xs uppercase text-neutral-400 mb-1`}>Ignoring files & folders:</p>
                        )}
                        <div
                            css={tw`
                                font-mono bg-[rgba(0,0,0,0.4)] 
                                rounded-lg py-1 px-2 
                                text-sm text-neutral-200 
                                inline-block whitespace-pre-wrap break-all shadow-inner
                            `}
                        >
                            {task.payload}
                        </div>
                    </div>
                )}
            </div>

            {/* Badges + Actions */}
            <div css={tw`mt-3 sm:mt-0 flex items-center w-full sm:w-auto`}>
                {task.continueOnFailure && (
                    <div css={tw`mr-6`}>
                        <div
                            css={tw`
                                flex items-center px-2 py-1 
                                bg-[rgba(234,179,8,0.2)] border border-yellow-400/40 
                                text-yellow-300 text-sm rounded-full backdrop-blur-md
                            `}
                        >
                            <Icon icon={faArrowCircleDown} css={tw`w-3 h-3 mr-2`} />
                            Continues on Failure
                        </div>
                    </div>
                )}
                {task.sequenceId > 1 && task.timeOffset > 0 && (
                    <div css={tw`mr-6`}>
                        <div
                            css={tw`
                                flex items-center px-2 py-1 
                                bg-[rgba(156,163,175,0.2)] border border-neutral-400/40 
                                text-neutral-300 text-sm rounded-full backdrop-blur-md
                            `}
                        >
                            <Icon icon={faClock} css={tw`w-3 h-3 mr-2`} />
                            {task.timeOffset}s later
                        </div>
                    </div>
                )}

                {/* Edit button */}
                <Can action={'schedule.update'}>
                    <button
                        type={'button'}
                        aria-label={'Edit scheduled task'}
                        css={tw`
                            block text-sm p-2 
                            text-neutral-400 hover:text-blue-300 
                            transition-colors duration-200 mr-4 ml-auto sm:ml-0
                        `}
                        onClick={() => setIsEditing(true)}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                </Can>

                {/* Delete button */}
                <Can action={'schedule.update'}>
                    <button
                        type={'button'}
                        aria-label={'Delete scheduled task'}
                        css={tw`
                            block text-sm p-2 
                            text-neutral-400 hover:text-red-400 
                            transition-colors duration-200
                        `}
                        onClick={() => setVisible(true)}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </Can>
            </div>
        </div>
    );
};
