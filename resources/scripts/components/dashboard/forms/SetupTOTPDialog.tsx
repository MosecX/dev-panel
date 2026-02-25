import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogWrapperContext } from '@/components/elements/dialog';
import getTwoFactorTokenData, { TwoFactorTokenData } from '@/api/account/getTwoFactorTokenData';
import { useFlashKey } from '@/plugins/useFlash';
import tw from 'twin.macro';
import QRCode from 'qrcode.react';
import { Button } from '@/components/elements/button/index';
import Spinner from '@/components/elements/Spinner';
import { Input } from '@/components/elements/inputs';
import CopyOnClick from '@/components/elements/CopyOnClick';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import enableAccountTwoFactor from '@/api/account/enableAccountTwoFactor';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import asDialog from '@/hoc/asDialog';
import styled from 'styled-components/macro';

interface Props {
    onTokens: (tokens: string[]) => void;
}

const StyledInput = styled(Input.Text)`
    ${tw`
        rounded-lg shadow-md
        bg-[rgba(255,255,255,0.05)] backdrop-blur-md
        border border-[rgba(255,255,255,0.15)]
        text-neutral-200
        focus:(outline-none ring-2 ring-cyan-500)
        transition-all duration-200
    `}
`;

const ConfigureTwoFactorForm = ({ onTokens }: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<TwoFactorTokenData | null>(null);
    const { clearAndAddHttpError } = useFlashKey('account:two-step');
    const updateUserData = useStoreActions((actions: Actions<ApplicationStore>) => actions.user.updateUserData);

    const { close, setProps } = useContext(DialogWrapperContext);

    useEffect(() => {
        getTwoFactorTokenData()
            .then(setToken)
            .catch((error) => clearAndAddHttpError(error));
    }, []);

    useEffect(() => {
        setProps((state) => ({ ...state, preventExternalClose: submitting }));
    }, [submitting]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (submitting) return;

        setSubmitting(true);
        clearAndAddHttpError();
        enableAccountTwoFactor(value, password)
            .then((tokens) => {
                updateUserData({ useTotp: true });
                onTokens(tokens);
            })
            .catch((error) => {
                clearAndAddHttpError(error);
                setSubmitting(false);
            });
    };

    return (
        <form
            id={'enable-totp-form'}
            onSubmit={submit}
            className="
                p-4 sm:p-6
                rounded-xl shadow-lg
                bg-[rgba(255,255,255,0.05)] backdrop-blur-md
                border border-[rgba(255,255,255,0.15)]
                transition-all duration-300
            "
        >
            <FlashMessageRender byKey={'account:two-step'} className={'mt-4'} />

            <div
                className="
                    flex items-center justify-center w-56 h-56 p-2
                    bg-[rgba(255,255,255,0.05)] backdrop-blur-md
                    border border-[rgba(255,255,255,0.15)]
                    rounded-xl shadow-md mx-auto mt-6
                "
            >
                {!token ? (
                    <Spinner />
                ) : (
                    <QRCode renderAs={'svg'} value={token.image_url_data} css={tw`w-full h-full shadow-none`} />
                )}
            </div>

            <CopyOnClick text={token?.secret}>
                <p className="font-mono text-sm text-cyan-300 text-center mt-2 tracking-widest">
                    {token?.secret.match(/.{1,4}/g)!.join(' ') || 'Loading...'}
                </p>
            </CopyOnClick>

            <p id={'totp-code-description'} className="mt-6 text-neutral-300">
                Scan the QR code above using the two-step authentication app of your choice. Then, enter the 6-digit
                code generated into the field below.
            </p>

            <StyledInput
                aria-labelledby={'totp-code-description'}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                className={'mt-3'}
                placeholder={'000000'}
                type={'text'}
                inputMode={'numeric'}
                autoComplete={'one-time-code'}
                pattern={'\\d{6}'}
            />

            <label htmlFor={'totp-password'} className="block mt-3 text-neutral-300">
                Account Password
            </label>
            <StyledInput
                id={'totp-password'}
                type={'password'}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                className={'mt-1'}
            />

            <Dialog.Footer>
                <Button.Text
                    onClick={close}
                    className="px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                    Cancel
                </Button.Text>
                <Tooltip
                    disabled={password.length > 0 && value.length === 6}
                    content={
                        !token
                            ? 'Waiting for QR code to load...'
                            : 'You must enter the 6-digit code and your password to continue.'
                    }
                    delay={100}
                >
                    <Button
                        disabled={!token || value.length !== 6 || !password.length}
                        type={'submit'}
                        form={'enable-totp-form'}
                        className="px-4 py-2 rounded-lg shadow-md bg-cyan-600 hover:bg-cyan-500 text-white transition-all duration-200"
                    >
                        Enable
                    </Button>
                </Tooltip>
            </Dialog.Footer>
        </form>
    );
};

export default asDialog({
    title: 'Enable Two-Step Verification',
    description:
        "Help protect your account from unauthorized access. You'll be prompted for a verification code each time you sign in.",
})(ConfigureTwoFactorForm);
