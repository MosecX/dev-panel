import React, { useContext } from 'react';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import asModal from '@/hoc/asModal';
import ModalContext from '@/context/ModalContext';

type Props = {
    title: string;
    buttonText: string;
    onConfirmed: () => void;
    showSpinnerOverlay?: boolean;
};

const ConfirmationModal: React.FC<Props> = ({ title, children, buttonText, onConfirmed }) => {
    const { dismiss } = useContext(ModalContext);

    return (
        <>
            <h2
                css={tw`text-2xl mb-6 font-semibold text-gray-100`}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
                {title}
            </h2>
            <div css={tw`text-gray-300 leading-relaxed`}>{children}</div>
            <div css={tw`flex flex-wrap items-center justify-end mt-8 space-x-3`}>
                <Button
                    isSecondary
                    onClick={() => dismiss()}
                    css={tw`w-full sm:w-auto border-transparent hover:border-cyan-400 hover:text-cyan-300 transition-all duration-200`}
                >
                    Cancel
                </Button>
                <Button
                    color={'red'}
                    css={tw`w-full sm:w-auto mt-4 sm:mt-0 sm:ml-0 hover:bg-red-600/50 transition-all duration-200`}
                    onClick={() => onConfirmed()}
                >
                    {buttonText}
                </Button>
            </div>
        </>
    );
};

ConfirmationModal.displayName = 'ConfirmationModal';

export default asModal<Props>((props) => ({
    showSpinnerOverlay: props.showSpinnerOverlay,
}))(ConfirmationModal);
