import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import Fade from '@/components/elements/Fade';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import useFlash from '@/plugins/useFlash';
import compressFiles from '@/api/server/files/compressFiles';
import { ServerContext } from '@/state/server';
import deleteFiles from '@/api/server/files/deleteFiles';
import RenameFileModal from '@/components/server/files/RenameFileModal';
import Portal from '@/components/elements/Portal';
import { Dialog } from '@/components/elements/dialog';

const MassActionsBar = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);

    const { mutate } = useFileManagerSwr();
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [showMove, setShowMove] = useState(false);
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const selectedFiles = ServerContext.useStoreState((state) => state.files.selectedFiles);
    const setSelectedFiles = ServerContext.useStoreActions((actions) => actions.files.setSelectedFiles);

    useEffect(() => {
        if (!loading) setLoadingMessage('');
    }, [loading]);

    const onClickCompress = () => {
        setLoading(true);
        clearFlashes('files');
        setLoadingMessage('Archiving files...');

        compressFiles(uuid, directory, selectedFiles)
            .then(() => mutate())
            .then(() => setSelectedFiles([]))
            .catch((error) => clearAndAddHttpError({ key: 'files', error }))
            .then(() => setLoading(false));
    };

    const onClickConfirmDeletion = () => {
        setLoading(true);
        setShowConfirm(false);
        clearFlashes('files');
        setLoadingMessage('Deleting files...');

        deleteFiles(uuid, directory, selectedFiles)
            .then(() => {
                mutate((files) => files.filter((f) => selectedFiles.indexOf(f.name) < 0), false);
                setSelectedFiles([]);
            })
            .catch((error) => {
                mutate();
                clearAndAddHttpError({ key: 'files', error });
            })
            .then(() => setLoading(false));
    };

    return (
        <>
            <div css={tw`pointer-events-none fixed bottom-0 z-20 left-0 right-0 flex justify-center`}>
                <SpinnerOverlay visible={loading} size={'large'} fixed>
                    {loadingMessage}
                </SpinnerOverlay>
                <Dialog.Confirm
                    title={'Delete Files'}
                    open={showConfirm}
                    confirm={'Delete'}
                    onClose={() => setShowConfirm(false)}
                    onConfirmed={onClickConfirmDeletion}
                >
                    <p className={'mb-2'}>
                        Are you sure you want to delete&nbsp;
                        <span className={'font-semibold text-red-300'}>{selectedFiles.length} files</span>? This is a
                        permanent action and the files cannot be recovered.
                    </p>
                    {selectedFiles.slice(0, 15).map((file) => (
                        <li key={file} className="text-gray-300">{file}</li>
                    ))}
                    {selectedFiles.length > 15 && (
                        <li className="text-gray-400">and {selectedFiles.length - 15} others</li>
                    )}
                </Dialog.Confirm>
                {showMove && (
                    <RenameFileModal
                        files={selectedFiles}
                        visible
                        appear
                        useMoveTerminology
                        onDismissed={() => setShowMove(false)}
                    />
                )}
                <Portal>
                    <div className={'pointer-events-none fixed bottom-0 mb-6 flex justify-center w-full z-50'}>
                        <Fade timeout={75} in={selectedFiles.length > 0} unmountOnExit>
                            <div
                                className="flex items-center space-x-4 pointer-events-auto rounded-xl p-4 
                                           border border-[rgba(255,255,255,0.08)] backdrop-blur-md 
                                           bg-[rgba(255,255,255,0.06)] shadow-lg transition-all duration-300"
                            >
                                <Button
                                    className="rounded-lg border border-cyan-400/40 bg-[rgba(255,255,255,0.08)] 
                                               backdrop-blur-md text-cyan-300 hover:border-cyan-300 
                                               hover:text-white transition-all duration-300"
                                    onClick={() => setShowMove(true)}
                                >
                                    Move
                                </Button>
                                <Button
                                    className="rounded-lg border border-indigo-400/40 bg-[rgba(255,255,255,0.08)] 
                                               backdrop-blur-md text-indigo-300 hover:border-indigo-300 
                                               hover:text-white transition-all duration-300"
                                    onClick={onClickCompress}
                                >
                                    Archive
                                </Button>
                                <Button.Danger
                                    variant={Button.Variants.Secondary}
                                    className="rounded-lg border border-red-400/40 bg-[rgba(255,255,255,0.08)] 
                                               backdrop-blur-md text-red-300 hover:border-red-300 
                                               hover:text-white transition-all duration-300"
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Delete
                                </Button.Danger>
                            </div>
                        </Fade>
                    </div>
                </Portal>
            </div>
        </>
    );
};

export default MassActionsBar;
