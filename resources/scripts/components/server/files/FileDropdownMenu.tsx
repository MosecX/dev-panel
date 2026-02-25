import React, { memo, useRef, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faCopy,
    faFileDownload,
    faLevelUpAlt,
    faTrashAlt,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import RenameFileModal from '@/components/server/files/RenameFileModal';
import { ServerContext } from '@/state/server';
import { join } from 'path';
import deleteFiles from '@/api/server/files/deleteFiles';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import copyFile from '@/api/server/files/copyFile';
import tw from 'twin.macro';
import { FileObject } from '@/api/server/files/loadDirectory';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import DropdownMenu from '@/components/elements/DropdownMenu';
import styled from 'styled-components/macro';
import useEventListener from '@/plugins/useEventListener';
import getFileDownloadUrl from '@/api/server/files/getFileDownloadUrl';
import { Dialog } from '@/components/elements/dialog';

type ModalType = 'edit' | 'rename' | 'move';

const StyledRow = styled.div<{ $danger?: boolean }>`
    ${tw`
        p-2 flex items-center rounded-lg transition-all duration-200 ease-in-out cursor-pointer
        border border-transparent select-none
    `};
    ${(props) =>
        props.$danger
            ? tw`
                hover:bg-red-500/30 hover:text-red-200 border border-red-400/30
                backdrop-blur-md bg-[rgba(255,0,0,0.05)] shadow-md
            `
            : tw`
                hover:bg-cyan-500/20 hover:text-cyan-200
                backdrop-blur-md bg-[rgba(255,255,255,0.06)]
                border border-[rgba(255,255,255,0.08)] shadow-md
            `};
`;

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: IconDefinition;
    title: string;
    $danger?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Row = ({ icon, title, onClick, ...props }: RowProps) => (
    <StyledRow
        {...props}
        onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
        }}
    >
        <FontAwesomeIcon icon={icon} css={tw`text-sm text-cyan-400`} fixedWidth />
        <span css={tw`ml-2 font-medium`}>{title}</span>
    </StyledRow>
);

const DropdownContainer = styled.div`
    ${tw`
        absolute z-50 rounded-xl p-2
        bg-[rgba(0,0,0,0.4)] backdrop-blur-md
        border border-[rgba(255,255,255,0.08)] shadow-xl
    `}
    isolation: isolate;
    pointer-events: auto;
`;

const Overlay = styled.div`
    ${tw`fixed inset-0 z-40`}
    background: transparent;
    pointer-events: auto;
`;

const FileDropdownMenu = ({ file }: { file: FileObject }) => {
    const onClickRef = useRef<DropdownMenu>(null);
    const [showSpinner, setShowSpinner] = useState(false);
    const [modal, setModal] = useState<ModalType | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { mutate } = useFileManagerSwr();
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    useEventListener(`pterodactyl:files:ctx:${file.key}`, (e: CustomEvent) => {
        if (onClickRef.current) {
            onClickRef.current.triggerMenu(e.detail);
        }
    });

    const doDeletion = useCallback(() => {
        mutate((files) => files.filter((f) => f.key !== file.key), false);
        deleteFiles(uuid, directory, [file.name]).catch(() => mutate());
    }, [mutate, uuid, directory, file.key, file.name]);

    const doCopy = useCallback(() => {
        setShowSpinner(true);
        copyFile(uuid, join(directory, file.name))
            .then(() => mutate())
            .finally(() => setShowSpinner(false));
    }, [uuid, directory, file.name, mutate]);

    const doDownload = useCallback(() => {
        setShowSpinner(true);
        getFileDownloadUrl(uuid, join(directory, file.name))
            .then((url) => {
                // @ts-expect-error this is valid
                window.location = url;
            })
            .finally(() => setShowSpinner(false));
    }, [uuid, directory, file.name]);

    return (
        <>
            {menuOpen && (
                <Overlay
                    onClick={(e) => {
                        e.stopPropagation();
                        // Cerrar el menú si tu DropdownMenu expone un método; si no, deja que el propio menú lo maneje.
                        setMenuOpen(false);
                    }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                />
            )}

            <Dialog.Confirm
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                title={`Eliminar ${file.isFile ? 'archivo' : 'carpeta'}`}
                confirm={'Eliminar'}
                onConfirmed={doDeletion}
            >
                No podrás recuperar el contenido de&nbsp;
                <span className={'font-semibold text-red-300'}>{file.name}</span> una vez eliminado.
            </Dialog.Confirm>

            <DropdownMenu
                ref={onClickRef}
                container={DropdownContainer}
                onOpenChange={(open: boolean) => setMenuOpen(open)}
                renderToggle={(onClick) => (
                    <div
                        css={tw`
                            px-4 py-2 text-gray-300 hover:text-cyan-400
                            transition-transform duration-200 ease-in-out cursor-pointer
                        `}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(e);
                        }}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                        {modal && (
                            <RenameFileModal
                                visible
                                appear
                                files={[file.name]}
                                useMoveTerminology={modal === 'move'}
                                onDismissed={() => setModal(null)}
                            />
                        )}
                        <SpinnerOverlay visible={showSpinner} fixed size={'large'} />
                    </div>
                )}
            >
                <Row onClick={() => setModal('edit')} icon={faPencilAlt} title={'Editar'} />
                <Row onClick={doCopy} icon={faCopy} title={'Copiar'} />
                <Row onClick={doDownload} icon={faFileDownload} title={'Descargar'} />
                <Row onClick={() => setModal('rename')} icon={faPencilAlt} title={'Renombrar'} />
                <Row onClick={() => setModal('move')} icon={faLevelUpAlt} title={'Mover'} />
                <Row onClick={() => setShowConfirmation(true)} icon={faTrashAlt} title={'Eliminar'} $danger />
            </DropdownMenu>
        </>
    );
};

export default memo(FileDropdownMenu);
