import React, { useState } from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Icon from '@/components/elements/Icon';
import { ServerContext } from '@/state/server';
import deleteServerAllocation from '@/api/server/network/deleteServerAllocation';
import getServerAllocations from '@/api/swr/getServerAllocations';
import { useFlashKey } from '@/plugins/useFlash';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import './animations.css';

interface Props {
    allocation: number;
}

const DeleteAllocationButton = ({ allocation }: Props) => {
    const [confirm, setConfirm] = useState(false);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);

    const { mutate } = getServerAllocations();
    const { clearFlashes, clearAndAddHttpError } = useFlashKey('server:network');

    const deleteAllocation = () => {
        clearFlashes();

        mutate((data) => data?.filter((a) => a.id !== allocation), false);
        setServerFromState((s) => ({ ...s, allocations: s.allocations.filter((a) => a.id !== allocation) }));

        deleteServerAllocation(uuid, allocation).catch((error) => {
            clearAndAddHttpError(error);
            mutate();
        });
    };

    return (
        <>
            <Dialog.Confirm
                open={confirm}
                onClose={() => setConfirm(false)}
                title={'Remove Allocation'}
                confirm={'Delete'}
                onConfirmed={deleteAllocation}
                className="rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl 
                           bg-[rgba(255,255,255,0.06)] shadow-2xl animate-fade-in p-6"
            >
                <p className="text-sm text-neutral-300 animate-slide-up">
                    This allocation will be immediately removed from your server.
                </p>
            </Dialog.Confirm>

            <Button.Danger
                variant={Button.Variants.Secondary}
                size={Button.Sizes.Small}
                shape={Button.Shapes.IconSquare}
                type={'button'}
                onClick={() => setConfirm(true)}
                className="rounded-lg border border-red-400/40 bg-[rgba(255,255,255,0.08)] backdrop-blur-md 
                           text-red-400 hover:border-red-500 hover:text-white transition-all duration-300 animate-fade-in"
            >
                <Icon icon={faTrashAlt} className="w-3 h-auto" />
            </Button.Danger>
        </>
    );
};

export default DeleteAllocationButton;
