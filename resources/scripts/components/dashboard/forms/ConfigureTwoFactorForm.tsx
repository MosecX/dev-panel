import React, { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import SetupTOTPDialog from '@/components/dashboard/forms/SetupTOTPDialog';
import RecoveryTokensDialog from '@/components/dashboard/forms/RecoveryTokensDialog';
import DisableTOTPDialog from '@/components/dashboard/forms/DisableTOTPDialog';
import { useFlashKey } from '@/plugins/useFlash';

export default () => {
    const [tokens, setTokens] = useState<string[]>([]);
    const [visible, setVisible] = useState<'enable' | 'disable' | null>(null);
    const isEnabled = useStoreState((state: ApplicationStore) => state.user.data!.useTotp);
    const { clearAndAddHttpError } = useFlashKey('account:two-step');

    useEffect(() => {
        return () => {
            clearAndAddHttpError();
        };
    }, [visible]);

    const onTokens = (tokens: string[]) => {
        setTokens(tokens);
        setVisible(null);
    };

    return (
        <div
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
            <SetupTOTPDialog open={visible === 'enable'} onClose={() => setVisible(null)} onTokens={onTokens} />
            <RecoveryTokensDialog tokens={tokens} open={tokens.length > 0} onClose={() => setTokens([])} />
            <DisableTOTPDialog open={visible === 'disable'} onClose={() => setVisible(null)} />

            <p className="text-sm text-neutral-300">
                {isEnabled
                    ? 'Two-step verification is currently enabled on your account.'
                    : 'You do not currently have two-step verification enabled on your account. Click the button below to begin configuring it.'}
            </p>

            <div className="mt-6 flex justify-end">
                {isEnabled ? (
                    <Button.Danger
                        className="px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setVisible('disable')}
                    >
                        Disable Two-Step
                    </Button.Danger>
                ) : (
                    <Button
                        className="px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => setVisible('enable')}
                    >
                        Enable Two-Step
                    </Button>
                )}
            </div>
        </div>
    );
};
