import React, { useState } from 'react';
import { ClipboardListIcon } from '@heroicons/react/outline';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';

export default ({ meta }: { meta: Record<string, unknown> }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={'self-center md:px-4'}>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                hideCloseIcon
                title={'Metadata'}
            >
                <pre
                    className={
                        'bg-[rgba(0,0,0,0.6)] backdrop-blur-md rounded-lg p-3 font-mono text-sm leading-relaxed ' +
                        'overflow-x-scroll whitespace-pre-wrap text-gray-200 border border-[rgba(255,255,255,0.08)] shadow-md'
                    }
                >
                    {JSON.stringify(meta, null, 2)}
                </pre>
                <Dialog.Footer>
                    <Button.Text
                        onClick={() => setOpen(false)}
                        className={
                            'text-cyan-300 hover:text-white transition-colors duration-200 ease-in-out'
                        }
                    >
                        Close
                    </Button.Text>
                </Dialog.Footer>
            </Dialog>
            <button
                aria-describedby={'View additional event metadata'}
                className={
                    'p-2 transition-all duration-200 ease-in-out text-gray-400 ' +
                    'hover:text-cyan-300 active:text-cyan-400 rounded-lg ' +
                    'bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] shadow-md'
                }
                onClick={() => setOpen(true)}
            >
                <ClipboardListIcon className={'w-5 h-5'} />
            </button>
        </div>
    );
};
