import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import reinstallServer from '@/api/server/reinstallServer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import { Dialog } from '@/components/elements/dialog';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [modalVisible, setModalVisible] = useState(false);
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const reinstall = () => {
        clearFlashes('settings');
        reinstallServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: 'Your server has begun the reinstallation process.',
                });
            })
            .catch((error) => {
                console.error(error);
                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .then(() => setModalVisible(false));
    };

    useEffect(() => {
        clearFlashes();
    }, []);

    return (
        <TitledGreyBox
            title={'Reinstall Server'}
            css={tw`
                relative rounded-xl border border-[rgba(255,255,255,0.08)]
                bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-lg p-6
            `}
        >
            <Dialog.Confirm
                open={modalVisible}
                title={'Confirm server reinstallation'}
                confirm={'Yes, reinstall server'}
                onClose={() => setModalVisible(false)}
                onConfirmed={reinstall}
            >
                <p css={tw`text-sm text-neutral-200`}>
                    Your server will be stopped and some files may be deleted or modified during this process.
                    <strong css={tw`font-medium text-red-300`}>
                        &nbsp;Please back up your data before continuing.
                    </strong>
                </p>
            </Dialog.Confirm>

            <p css={tw`text-sm text-neutral-300`}>
                Reinstalling your server will stop it, and then re-run the installation script that initially set it up.
                <strong css={tw`font-medium text-red-300`}>
                    &nbsp;Some files may be deleted or modified during this process, please back up your data before continuing.
                </strong>
            </p>

            <div css={tw`mt-6 text-right`}>
                <button
                    type="button"
                    onClick={() => setModalVisible(true)}
                    className="
                        px-6 py-2 rounded-lg border border-red-400/40 
                        bg-[rgba(239,68,68,0.15)] backdrop-blur-md 
                        text-red-300 font-semibold shadow-md 
                        transition transform hover:scale-105 
                        hover:border-red-400 hover:text-red-200 
                        disabled:opacity-50
                    "
                >
                    Reinstall Server
                </button>
            </div>
        </TitledGreyBox>
    );
};
