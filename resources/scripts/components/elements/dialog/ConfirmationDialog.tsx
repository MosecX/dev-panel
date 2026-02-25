import React from 'react';
import { Dialog, RenderDialogProps } from './';
import { Button } from '@/components/elements/button/index';

type ConfirmationProps = Omit<RenderDialogProps, 'description' | 'children'> & {
    children: React.ReactNode;
    confirm?: string | undefined;
    onConfirmed: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default ({ confirm = 'Okay', children, onConfirmed, ...props }: ConfirmationProps) => {
    return (
        <Dialog
            {...props}
            description={typeof children === 'string' ? children : undefined}
            className={
                'bg-[rgba(0,0,0,0.6)] backdrop-blur-md rounded-xl shadow-xl border border-[rgba(255,255,255,0.08)] text-gray-200'
            }
        >
            {typeof children !== 'string' && (
                <div className="text-gray-300">{children}</div>
            )}
            <Dialog.Footer className="flex justify-end space-x-3 mt-4">
                <Button.Text
                    onClick={props.onClose}
                    className="text-cyan-300 hover:text-white transition-colors duration-200 ease-in-out"
                >
                    Cancel
                </Button.Text>
                <Button.Danger
                    onClick={onConfirmed}
                    className="bg-red-600/30 text-red-300 border border-red-500/40 hover:bg-red-600/50 hover:text-red-200 active:scale-[0.97]"
                >
                    {confirm}
                </Button.Danger>
            </Dialog.Footer>
        </Dialog>
    );
};
