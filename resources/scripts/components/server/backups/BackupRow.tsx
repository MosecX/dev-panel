import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faLock, faDownload, faRedo, faTrash, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { format, formatDistanceToNow } from 'date-fns';
import Spinner from '@/components/elements/Spinner';
import { bytesToString } from '@/lib/formatters';
import Can from '@/components/elements/Can';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import getServerBackups from '@/api/swr/getServerBackups';
import { ServerBackup } from '@/api/server/types';
import { SocketEvent } from '@/components/server/events';
import { ServerContext } from '@/state/server';
import getBackupDownloadUrl from '@/api/server/backups/getBackupDownloadUrl';
import deleteBackup from '@/api/server/backups/deleteBackup';
import { restoreServerBackup } from '@/api/server/backups';
import http, { httpErrorToHuman } from '@/api/http';
import { Dialog } from '@/components/elements/dialog';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import useFlash from '@/plugins/useFlash';
import Input from '@/components/elements/Input';

interface Props {
    backup: ServerBackup;
    className?: string;
}

export default ({ backup, className }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const setServerFromState = ServerContext.useStoreActions((actions) => actions.server.setServerFromState);
    const { mutate } = getServerBackups();
    const { clearFlashes, clearAndAddHttpError } = useFlash();

    const [modal, setModal] = useState('');
    const [loading, setLoading] = useState(false);
    const [truncate, setTruncate] = useState(false);

    // Handlers reales (copiados del ContextMenu)
    const doDownload = () => {
        setLoading(true);
        clearFlashes('backups');
        getBackupDownloadUrl(uuid, backup.uuid)
            .then((url) => {
                // @ts-expect-error válido
                window.location = url;
            })
            .catch((error) => clearAndAddHttpError({ key: 'backups', error }))
            .finally(() => setLoading(false));
    };

    const doDeletion = () => {
        setLoading(true);
        clearFlashes('backups');
        deleteBackup(uuid, backup.uuid)
            .then(() =>
                mutate(
                    (data) => ({
                        ...data,
                        items: data.items.filter((b) => b.uuid !== backup.uuid),
                        backupCount: data.backupCount - 1,
                    }),
                    false
                )
            )
            .catch((error) => {
                clearAndAddHttpError({ key: 'backups', error });
                setLoading(false);
                setModal('');
            });
    };

    const doRestorationAction = () => {
        setLoading(true);
        clearFlashes('backups');
        restoreServerBackup(uuid, backup.uuid, truncate)
            .then(() =>
                setServerFromState((s) => ({
                    ...s,
                    status: 'restoring_backup',
                }))
            )
            .catch((error) => clearAndAddHttpError({ key: 'backups', error }))
            .finally(() => {
                setLoading(false);
                setModal('');
            });
    };

    const onLockToggle = () => {
        if (backup.isLocked && modal !== 'unlock') {
            return setModal('unlock');
        }

        http.post(`/api/client/servers/${uuid}/backups/${backup.uuid}/lock`)
            .then(() =>
                mutate(
                    (data) => ({
                        ...data,
                        items: data.items.map((b) =>
                            b.uuid !== backup.uuid ? b : { ...b, isLocked: !b.isLocked }
                        ),
                    }),
                    false
                )
            )
            .catch((error) => alert(httpErrorToHuman(error)))
            .finally(() => setModal(''));
    };

    useWebsocketEvent(`${SocketEvent.BACKUP_COMPLETED}:${backup.uuid}` as SocketEvent, (data) => {
        try {
            const parsed = JSON.parse(data);
            mutate(
                (data) => ({
                    ...data,
                    items: data.items.map((b) =>
                        b.uuid !== backup.uuid
                            ? b
                            : {
                                  ...b,
                                  isSuccessful: parsed.is_successful || true,
                                  checksum: (parsed.checksum_type || '') + ':' + (parsed.checksum || ''),
                                  bytes: parsed.file_size || 0,
                                  completedAt: new Date(),
                              }
                    ),
                }),
                false
            );
        } catch (e) {
            console.warn(e);
        }
    });

    return (
        <GreyRowBox css={tw`flex-wrap md:flex-nowrap items-center`} className={className}>
            <SpinnerOverlay visible={loading} fixed />

            {/* Info */}
            <div css={tw`flex items-center truncate w-full md:flex-1`}>
                <div css={tw`mr-4`}>
                    {backup.completedAt !== null ? (
                        backup.isLocked ? (
                            <FontAwesomeIcon icon={faLock} css={tw`text-yellow-500`} />
                        ) : (
                            <FontAwesomeIcon icon={faArchive} css={tw`text-neutral-300`} />
                        )
                    ) : (
                        <Spinner size={'small'} />
                    )}
                </div>
                <div css={tw`flex flex-col truncate`}>
                    <div css={tw`flex items-center text-sm mb-1`}>
                        {backup.completedAt !== null && !backup.isSuccessful && (
                            <span css={tw`bg-red-500 py-px px-2 rounded-full text-white text-xs uppercase border border-red-600 mr-2`}>
                                Failed
                            </span>
                        )}
                        <p css={tw`break-words truncate`}>{backup.name}</p>
                        {backup.completedAt !== null && backup.isSuccessful && (
                            <span css={tw`ml-3 text-neutral-300 text-xs font-extralight hidden sm:inline`}>
                                {bytesToString(backup.bytes)}
                            </span>
                        )}
                    </div>
                    <p css={tw`mt-1 md:mt-0 text-xs text-neutral-400 font-mono truncate`}>{backup.checksum}</p>
                </div>
            </div>

            {/* Fecha */}
            <div css={tw`flex-1 md:flex-none md:w-48 mt-4 md:mt-0 md:ml-8 md:text-center`}>
                <p title={format(backup.createdAt, 'ddd, MMMM do, yyyy HH:mm:ss')} css={tw`text-sm`}>
                    {formatDistanceToNow(backup.createdAt, { includeSeconds: true, addSuffix: true })}
                </p>
                <p css={tw`text-2xs text-neutral-500 uppercase mt-1`}>Created</p>
            </div>

            {/* Botones visibles */}
<Can action={['backup.download', 'backup.restore', 'backup.delete']} matchAny>
    <div
        className="
            mt-4 md:mt-0 ml-0 md:ml-6 
            flex flex-wrap gap-2 
            w-full md:w-auto 
            justify-start md:justify-end
        "
    >
        {backup.completedAt && (
            <>
                {/* Download */}
                <button
                    className="
                        flex-1 md:flex-none px-4 py-2 
                        rounded-lg border border-blue-400/40 
                        bg-[rgba(59,130,246,0.15)] backdrop-blur-md 
                        text-blue-300 font-semibold shadow-md 
                        transition transform hover:scale-105 
                        hover:border-blue-400 hover:text-blue-200 
                        disabled:opacity-50
                    "
                    onClick={doDownload}
                >
                    <FontAwesomeIcon icon={faDownload} className="text-xs" />
                    <span className="hidden sm:inline">Download</span>
                </button>

                {/* Restore */}
                <button
                    className="
                        flex-1 md:flex-none px-4 py-2 
                        rounded-lg border border-yellow-400/40 
                        bg-[rgba(234,179,8,0.15)] backdrop-blur-md 
                        text-yellow-300 font-semibold shadow-md 
                        transition transform hover:scale-105 
                        hover:border-yellow-400 hover:text-yellow-200 
                        disabled:opacity-50
                    "
                    onClick={() => setModal('restore')}
                >
                    <FontAwesomeIcon icon={faRedo} className="text-xs" />
                    <span className="hidden sm:inline">Restore</span>
                </button>

                {/* Lock / Unlock */}
                <button
                    className={`
                        flex-1 md:flex-none px-4 py-2 
                        rounded-lg border 
                        ${backup.isLocked 
                            ? 'border-green-400/40 bg-[rgba(34,197,94,0.15)] text-green-300 hover:border-green-400 hover:text-green-200' 
                            : 'border-yellow-400/40 bg-[rgba(234,179,8,0.15)] text-yellow-300 hover:border-yellow-400 hover:text-yellow-200'} 
                        backdrop-blur-md font-semibold shadow-md 
                        transition transform hover:scale-105 
                        disabled:opacity-50
                    `}
                    onClick={onLockToggle}
                >
                    <FontAwesomeIcon icon={backup.isLocked ? faUnlock : faLock} className="text-xs" />
                    {backup.isLocked ? 'Unlock' : 'Lock'}
                </button>

                {/* Delete */}
                {!backup.isLocked && (
                    <button
                        className="
                            flex-1 md:flex-none px-4 py-2 
                            rounded-lg border border-red-400/40 
                            bg-[rgba(239,68,68,0.15)] backdrop-blur-md 
                            text-red-300 font-semibold shadow-md 
                            transition transform hover:scale-105 
                            hover:border-red-400 hover:text-red-200 
                            disabled:opacity-50
                        "
                        onClick={() => setModal('delete')}
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                )}
            </>
        )}
    </div>
</Can>

            {/* Dialogs */}
            <Dialog.Confirm
                open={modal === 'unlock'}
                onClose={() => setModal('')}
                title={`Unlock "${backup.name}"`}
                onConfirmed={onLockToggle}
            >
                This backup will no longer be protected from automated or accidental deletions.
            </Dialog.Confirm>

            <Dialog.Confirm
                open={modal === 'restore'}
                onClose={() => setModal('')}
                confirm={'Restore'}
                title={`Restore "${backup.name}"`}
                onConfirmed={doRestorationAction}
            >
                <p>
                    Your server will be stopped. You will not be able to control the power state, access the file
                    manager, or create additional backups until completed.
                </p>
                <p css={tw`mt-4 -mb-2 bg-gray-700 p-3 rounded`}>
                    <label htmlFor={'restore_truncate'} css={tw`text-base flex items-center cursor-pointer`}>
                        <Input
                            type={'checkbox'}
                            css={tw`text-red-500! w-5! h-5! mr-2`}
                            id={'restore_truncate'}
                            value={'true'}
                            checked={truncate}
                            onChange={() => setTruncate((s) => !s)}
                        />
                        Delete all files before restoring backup.
                    </label>
                </p>
            </Dialog.Confirm>

            <Dialog.Confirm
                title={`Delete "${backup.name}"`}
                confirm={'Continue'}
                open={modal === 'delete'}
                onClose={() => setModal('')}
                onConfirmed={doDeletion}
            >
                This is a permanent operation. The backup cannot be recovered once deleted.
            </Dialog.Confirm>
        </GreyRowBox>
    );
};
