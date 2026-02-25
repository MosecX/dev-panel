import React from 'react';
import { Dialog, DialogProps } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { Alert } from '@/components/elements/alert';
import tw from 'twin.macro';

interface RecoveryTokenDialogProps extends DialogProps {
    tokens: string[];
}

export default ({ tokens, open, onClose }: RecoveryTokenDialogProps) => {
    const grouped = [] as [string, string][];
    tokens.forEach((token, index) => {
        if (index % 2 === 0) {
            grouped.push([token, tokens[index + 1] || '']);
        }
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            title={'Two-Step Authentication Enabled'}
            description={
                'Store the codes below somewhere safe. If you lose access to your phone you can use these backup codes to sign in.'
            }
            hideCloseIcon
            preventExternalClose
        >
            <Dialog.Icon position={'container'} type={'success'} />

            <CopyOnClick text={tokens.join('\n')} showInNotification={false}>
                <pre
                    className="
                        mt-6 p-4 rounded-xl shadow-md
                        bg-[rgba(255,255,255,0.05)] backdrop-blur-md
                        border border-[rgba(255,255,255,0.15)]
                        text-neutral-200 font-mono text-sm
                        transition-all duration-200
                    "
                >
                    {grouped.map((value) => (
                        <span key={value.join('_')} className={'block'}>
                            {value[0]}
                            <span className={'mx-2 selection:bg-gray-800'}>&nbsp;</span>
                            {value[1]}
                            <span className={'selection:bg-gray-800'}>&nbsp;</span>
                        </span>
                    ))}
                </pre>
            </CopyOnClick>

            <Alert
                type={'danger'}
                className="
                    mt-3 rounded-lg shadow-sm
                    bg-red-500/10 border border-red-400/30
                    text-red-300
                "
            >
                These codes will not be shown again.
            </Alert>

            <Dialog.Footer>
                <Button.Text
                    onClick={onClose}
                    className="
                        px-4 py-2 rounded-lg shadow-md
                        bg-[rgba(255,255,255,0.05)] backdrop-blur-sm
                        border border-[rgba(255,255,255,0.1)]
                        text-neutral-200
                        transition-all duration-200
                        hover:(bg-cyan-500/20 border-cyan-400 text-cyan-300)
                    "
                >
                    Done
                </Button.Text>
            </Dialog.Footer>
        </Dialog>
    );
};
