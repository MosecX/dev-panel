import React, { useState } from 'react';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import { ServerContext } from '@/state/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subuser } from '@/state/server/subusers';
import deleteSubuser from '@/api/server/users/deleteSubuser';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';

export default ({ subuser }: { subuser: Subuser }) => {
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const removeSubuser = ServerContext.useStoreActions((actions) => actions.subusers.removeSubuser);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const doDeletion = () => {
        setLoading(true);
        clearFlashes('users');
        deleteSubuser(uuid, subuser.uuid)
            .then(() => {
                setLoading(false);
                removeSubuser(subuser.uuid);
            })
            .catch((error) => {
                console.error(error);
                addError({ key: 'users', message: httpErrorToHuman(error) });
                setShowConfirmation(false);
            });
    };

    return (
        <>
            <ConfirmationModal
                title={'Delete this subuser?'}
                buttonText={'Yes, remove subuser'}
                visible={showConfirmation}
                showSpinnerOverlay={loading}
                onConfirmed={() => doDeletion()}
                onModalDismissed={() => setShowConfirmation(false)}
            >
                <p css={tw`text-sm text-neutral-200`}>
                    Are you sure you wish to remove this subuser? 
                    <strong css={tw`text-red-300`}>
                        &nbsp;They will have all access to this server revoked immediately.
                    </strong>
                </p>
            </ConfirmationModal>

            <button
                type="button"
                aria-label="Delete subuser"
                onClick={() => setShowConfirmation(true)}
                className="
                    block text-sm p-2 rounded-lg 
                    border border-red-400/40 
                    bg-[rgba(239,68,68,0.15)] backdrop-blur-md 
                    text-red-300 shadow-md 
                    transition transform hover:scale-105 
                    hover:border-red-400 hover:text-red-200
                "
            >
                <FontAwesomeIcon icon={faTrashAlt} />
            </button>
        </>
    );
};
