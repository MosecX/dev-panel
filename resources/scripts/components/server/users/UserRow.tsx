import React, { useState } from 'react';
import { Subuser } from '@/state/server/subusers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUnlockAlt, faUserLock } from '@fortawesome/free-solid-svg-icons';
import RemoveSubuserButton from '@/components/server/users/RemoveSubuserButton';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import Can from '@/components/elements/Can';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';

interface Props {
    subuser: Subuser;
}

export default ({ subuser }: Props) => {
    const uuid = useStoreState((state) => state.user!.data!.uuid);
    const [visible, setVisible] = useState(false);

    return (
        <GreyRowBox
            css={tw`
                mb-2 rounded-xl border border-[rgba(255,255,255,0.08)]
                bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-md
                flex items-center p-3 transition hover:scale-[1.01]
            `}
        >
            <EditSubuserModal subuser={subuser} visible={visible} onModalDismissed={() => setVisible(false)} />

            {/* Avatar */}
            <div
                css={tw`
                    w-10 h-10 rounded-full border-2 border-neutral-700 
                    overflow-hidden hidden md:block shadow-inner
                `}
            >
                <img css={tw`w-full h-full`} src={`${subuser.image}?s=400`} />
            </div>

            {/* Email */}
            <div css={tw`ml-4 flex-1 overflow-hidden`}>
                <p css={tw`text-sm truncate text-neutral-100 font-semibold`}>{subuser.email}</p>
            </div>

            {/* 2FA */}
            <div css={tw`ml-4`}>
                <p css={tw`font-medium text-center`}>
                    <FontAwesomeIcon
                        icon={subuser.twoFactorEnabled ? faUserLock : faUnlockAlt}
                        fixedWidth
                        css={!subuser.twoFactorEnabled ? tw`text-red-400` : tw`text-green-400`}
                    />
                </p>
                <p css={tw`text-2xs text-neutral-400 uppercase hidden md:block`}>2FA Enabled</p>
            </div>

            {/* Permissions count */}
            <div css={tw`ml-4 hidden md:block`}>
                <p css={tw`font-medium text-center text-neutral-100`}>
                    {subuser.permissions.filter((permission) => permission !== 'websocket.connect').length}
                </p>
                <p css={tw`text-2xs text-neutral-400 uppercase`}>Permissions</p>
            </div>

            {/* Actions */}
            {subuser.uuid !== uuid && (
                <>
                    <Can action={'user.update'}>
                        <button
                            type="button"
                            aria-label="Edit subuser"
                            css={tw`
                                block text-sm p-2 rounded-lg 
                                text-neutral-400 hover:text-blue-300 
                                transition-colors duration-200 mx-2
                            `}
                            onClick={() => setVisible(true)}
                        >
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                    </Can>
                    <Can action={'user.delete'}>
                        <RemoveSubuserButton subuser={subuser} />
                    </Can>
                </>
            )}
        </GreyRowBox>
    );
};
