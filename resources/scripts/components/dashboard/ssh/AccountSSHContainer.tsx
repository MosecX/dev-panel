import React, { useEffect } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import FlashMessageRender from '@/components/FlashMessageRender';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { useSSHKeys } from '@/api/account/ssh-keys';
import { useFlashKey } from '@/plugins/useFlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import CreateSSHKeyForm from '@/components/dashboard/ssh/CreateSSHKeyForm';
import DeleteSSHKeyButton from '@/components/dashboard/ssh/DeleteSSHKeyButton';

export default () => {
    const { clearAndAddHttpError } = useFlashKey('account');
    const { data, isValidating, error } = useSSHKeys({
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <PageContentBlock
            title={'SSH Keys'}
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
                {/* Crear SSH Key */}
                <ContentBox
                    title={'Add SSH Key'}
                    css={tw`flex-none w-full md:w-1/2 rounded-xl shadow-md bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.15)]`}
                >
                    <CreateSSHKeyForm />
                </ContentBox>

                {/* Lista de SSH Keys */}
                <ContentBox
                    title={'SSH Keys'}
                    css={tw`flex-1 overflow-hidden mt-8 md:mt-0 md:ml-0 rounded-xl shadow-md bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.15)]`}
                >
                    <SpinnerOverlay visible={!data && isValidating} />
                    {!data || !data.length ? (
                        <p className="text-center text-sm text-neutral-400">
                            {!data ? 'Loading...' : 'No SSH Keys exist for this account.'}
                        </p>
                    ) : (
                        data.map((key, index) => (
                            <GreyRowBox
                                key={key.fingerprint}
                                css={[
                                    tw`flex items-center space-x-4 rounded-lg shadow-sm bg-[rgba(255,255,255,0.08)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] p-3`,
                                    index > 0 && tw`mt-2`,
                                ]}
                            >
                                <FontAwesomeIcon icon={faKey} css={tw`text-cyan-400`} />
                                <div css={tw`flex-1`}>
                                    <p css={tw`text-sm break-words font-medium text-neutral-200`}>{key.name}</p>
                                    <p css={tw`text-xs mt-1 font-mono truncate text-neutral-300`}>
                                        SHA256:{key.fingerprint}
                                    </p>
                                    <p css={tw`text-xs mt-1 text-neutral-400 uppercase`}>
                                        Added on:&nbsp;
                                        {format(key.createdAt, 'MMM do, yyyy HH:mm')}
                                    </p>
                                </div>
                                <DeleteSSHKeyButton name={key.name} fingerprint={key.fingerprint} />
                            </GreyRowBox>
                        ))
                    )}
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
