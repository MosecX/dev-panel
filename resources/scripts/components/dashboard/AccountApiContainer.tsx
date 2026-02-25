import React, { useEffect, useState } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import CreateApiKeyForm from '@/components/dashboard/forms/CreateApiKeyForm';
import getApiKeys, { ApiKey } from '@/api/account/getApiKeys';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import deleteApiKey from '@/api/account/deleteApiKey';
import FlashMessageRender from '@/components/FlashMessageRender';
import { format } from 'date-fns';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { Dialog } from '@/components/elements/dialog';
import { useFlashKey } from '@/plugins/useFlash';
import Code from '@/components/elements/Code';

export default () => {
    const [deleteIdentifier, setDeleteIdentifier] = useState('');
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const { clearAndAddHttpError } = useFlashKey('account');

    useEffect(() => {
        getApiKeys()
            .then((keys) => setKeys(keys))
            .then(() => setLoading(false))
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    const doDeletion = (identifier: string) => {
        setLoading(true);

        clearAndAddHttpError();
        deleteApiKey(identifier)
            .then(() => setKeys((s) => [...(s || []).filter((key) => key.identifier !== identifier)]))
            .catch((error) => clearAndAddHttpError(error))
            .then(() => {
                setLoading(false);
                setDeleteIdentifier('');
            });
    };

    return (
        <PageContentBlock
            title={'Account API'}
            className="
                p-4 sm:p-6
                rounded-xl
                shadow-lg
                bg-[rgba(255,255,255,0.05)]
                backdrop-blur-md
                border border-[rgba(255,255,255,0.15)]
                transition-all duration-300
            "
        >
            <FlashMessageRender byKey={'account'} />
            <div className="md:flex flex-nowrap my-10 gap-6">
                {/* Crear API Key */}
                <ContentBox
                    title={'Create API Key'}
                    css={tw`flex-none w-full md:w-1/2 rounded-xl shadow-md bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.15)]`}
                >
                    <CreateApiKeyForm onKeyCreated={(key) => setKeys((s) => [...s!, key])} />
                </ContentBox>

                {/* Lista de API Keys */}
                <ContentBox
                    title={'API Keys'}
                    css={tw`flex-1 overflow-hidden mt-8 md:mt-0 md:ml-0 rounded-xl shadow-md bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.15)]`}
                >
                    <SpinnerOverlay visible={loading} />
                    <Dialog.Confirm
                        title={'Delete API Key'}
                        confirm={'Delete Key'}
                        open={!!deleteIdentifier}
                        onClose={() => setDeleteIdentifier('')}
                        onConfirmed={() => doDeletion(deleteIdentifier)}
                    >
                        All requests using the <Code>{deleteIdentifier}</Code> key will be invalidated.
                    </Dialog.Confirm>

                    {keys.length === 0 ? (
                        <p className="text-center text-sm text-neutral-400">
                            {loading ? 'Loading...' : 'No API keys exist for this account.'}
                        </p>
                    ) : (
                        keys.map((key, index) => (
                            <GreyRowBox
                                key={key.identifier}
                                css={[
                                    tw`flex items-center rounded-lg shadow-sm bg-[rgba(255,255,255,0.08)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] p-3`,
                                    index > 0 && tw`mt-2`,
                                ]}
                            >
                                <FontAwesomeIcon icon={faKey} css={tw`text-cyan-400`} />
                                <div css={tw`ml-4 flex-1 overflow-hidden`}>
                                    <p css={tw`text-sm break-words text-neutral-200`}>{key.description}</p>
                                    <p css={tw`text-2xs text-neutral-400 uppercase`}>
                                        Last used:&nbsp;
                                        {key.lastUsedAt ? format(key.lastUsedAt, 'MMM do, yyyy HH:mm') : 'Never'}
                                    </p>
                                </div>
                                <p css={tw`text-sm ml-4 hidden md:block`}>
                                    <code css={tw`font-mono py-1 px-2 bg-neutral-900 rounded text-cyan-300`}>
                                        {key.identifier}
                                    </code>
                                </p>
                                <button
                                    css={tw`ml-4 p-2 text-sm hover:bg-[rgba(255,255,255,0.05)] rounded transition-all duration-200`}
                                    onClick={() => setDeleteIdentifier(key.identifier)}
                                >
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        css={tw`text-neutral-400 hover:text-red-400 transition-colors duration-150`}
                                    />
                                </button>
                            </GreyRowBox>
                        ))
                    )}
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
