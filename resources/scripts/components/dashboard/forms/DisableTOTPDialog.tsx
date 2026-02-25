import React, { useContext, useEffect, useState } from 'react';
import asDialog from '@/hoc/asDialog';
import { Dialog, DialogWrapperContext } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import { Input } from '@/components/elements/inputs';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import disableAccountTwoFactor from '@/api/account/disableAccountTwoFactor';
import { useFlashKey } from '@/plugins/useFlash';
import { useStoreActions } from '@/state/hooks';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import styled from 'styled-components/macro';

const StyledInput = styled(Input.Text)`
    ${tw`
        rounded-lg shadow-md
        bg-[rgba(255,255,255,0.05)] backdrop-blur-md
        border border-[rgba(255,255,255,0.15)]
        text-neutral-200
        focus:(outline-none ring-2 ring-red-500)
        transition-all duration-200
    `}
`;

const DisableTOTPDialog = () => {
    const [submitting, setSubmitting] = useState(false);
    const [password, setPassword] = useState('');
    const { clearAndAddHttpError } = useFlashKey('account:two-step');
    const { close, setProps } = useContext(DialogWrapperContext);
    const updateUserData = useStoreActions((actions) => actions.user.updateUserData);

    useEffect(() => {
        setProps((state) => ({ ...state, preventExternalClose: submitting }));
    }, [submitting]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (submitting) return;

        setSubmitting(true);
        clearAndAddHttpError();
        disableAccountTwoFactor(password)
            .then(() => {
                updateUserData({ useTotp: false });
                close();
            })
            .catch(clearAndAddHttpError)
            .then(() => setSubmitting(false));
    };

    return (
        <form
            id={'disable-totp-form'}
            className="
                mt-6 p-4 sm:p-6
                rounded-xl shadow-lg
                bg-[rgba(255,255,255,0.05)] backdrop-blur-md
                border border-[rgba(255,255,255,0.15)]
                transition-all duration-300
            "
            onSubmit={submit}
        >
            <FlashMessageRender byKey={'account:two-step'} className={'-mt-2 mb-6'} />
            <label className={'block pb-1 text-neutral-300'} htmlFor={'totp-password'}>
                Password
            </label>
            <StyledInput
                id={'totp-password'}
                type={'password'}
                variant={Input.Text.Variants.Loose}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Dialog.Footer>
                <Button.Text
                    className="px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                    onClick={close}
                >
                    Cancel
                </Button.Text>
                <Tooltip
                    delay={100}
                    disabled={password.length > 0}
                    content={'You must enter your account password to continue.'}
                >
                    <Button.Danger
                        type={'submit'}
                        form={'disable-totp-form'}
                        disabled={submitting || !password.length}
                        className="px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                    >
                        Disable
                    </Button.Danger>
                </Tooltip>
            </Dialog.Footer>
        </form>
    );
};

export default asDialog({
    title: 'Disable Two-Step Verification',
    description: 'Disabling two-step verification will make your account less secure.',
})(DisableTOTPDialog);
