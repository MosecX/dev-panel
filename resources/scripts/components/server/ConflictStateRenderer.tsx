import React from 'react';
import { ServerContext } from '@/state/server';
import ScreenBlock from '@/components/elements/ScreenBlock';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';

export default () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);
    const isNodeUnderMaintenance = ServerContext.useStoreState(
        (state) => state.server.data?.isNodeUnderMaintenance || false
    );

    const blockClass = `
        rounded-xl shadow-2xl border border-[rgba(255,255,255,0.08)]
        backdrop-blur-xl bg-[rgba(255,255,255,0.05)] p-6
        transition transform hover:scale-[1.02]
        text-neutral-100
    `;

    if (status === 'installing' || status === 'install_failed' || status === 'reinstall_failed') {
        return (
            <ScreenBlock
                title="Running Installer"
                image={ServerInstallSvg}
                message="Your server should be ready soon, please try again in a few minutes."
                className={blockClass}
            />
        );
    }

    if (status === 'suspended') {
        return (
            <ScreenBlock
                title="Server Suspended"
                image={ServerErrorSvg}
                message="This server is suspended and cannot be accessed."
                className={blockClass}
            />
        );
    }

    if (isNodeUnderMaintenance) {
        return (
            <ScreenBlock
                title="Node under Maintenance"
                image={ServerErrorSvg}
                message="The node of this server is currently under maintenance."
                className={blockClass}
            />
        );
    }

    return (
        <ScreenBlock
            title={isTransferring ? 'Transferring' : 'Restoring from Backup'}
            image={ServerRestoreSvg}
            message={
                isTransferring
                    ? 'Your server is being transferred to a new node, please check back later.'
                    : 'Your server is currently being restored from a backup, please check back in a few minutes.'
            }
            className={blockClass}
        />
    );
};
