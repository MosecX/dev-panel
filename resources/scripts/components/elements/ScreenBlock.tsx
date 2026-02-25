import React from 'react';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import NotFoundSvg from '@/assets/images/not_found.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';

interface BaseProps {
    title: string;
    image: string;
    message: string;
    onRetry?: () => void;
    onBack?: () => void;
}

interface PropsWithRetry extends BaseProps {
    onRetry?: () => void;
    onBack?: never;
}

interface PropsWithBack extends BaseProps {
    onBack?: () => void;
    onRetry?: never;
}

export type ScreenBlockProps = PropsWithBack | PropsWithRetry;

const spin = keyframes`
    to { transform: rotate(360deg) }
`;

const ActionButton = styled(Button)`
    ${tw`rounded-full w-8 h-8 flex items-center justify-center p-0 transition-all duration-300 ease-in-out`};

    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #e2e8f0;

    &:hover {
        background: rgba(34, 211, 238, 0.25);
        border-color: #22d3ee;
        color: #22d3ee;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
    }

    &.hover\\:spin:hover {
        animation: ${spin} 2s linear infinite;
    }
`;

const ScreenBlock = ({ title, image, message, onBack, onRetry }: ScreenBlockProps) => (
    <PageContentBlock>
        <div css={tw`flex justify-center`}>
            <div
                className="w-full sm:w-3/4 md:w-1/2 p-12 md:p-20 
                           bg-[rgba(255,255,255,0.08)] backdrop-blur-xl 
                           rounded-xl shadow-2xl text-center relative 
                           border border-[rgba(255,255,255,0.1)] transition-all duration-300 animate-fade-in"
            >
                {(typeof onBack === 'function' || typeof onRetry === 'function') && (
                    <div css={tw`absolute left-0 top-0 ml-4 mt-4`}>
                        <ActionButton
                            onClick={() => (onRetry ? onRetry() : onBack ? onBack() : null)}
                            className={onRetry ? 'hover:spin' : undefined}
                        >
                            <FontAwesomeIcon icon={onRetry ? faSyncAlt : faArrowLeft} />
                        </ActionButton>
                    </div>
                )}
                <img src={image} css={tw`w-2/3 h-auto select-none mx-auto`} />
                <h2 css={tw`mt-10 font-bold text-4xl text-neutral-100`}>{title}</h2>
                <p css={tw`text-sm text-neutral-300 mt-2`}>{message}</p>
            </div>
        </div>
    </PageContentBlock>
);

type ServerErrorProps = (Omit<PropsWithBack, 'image' | 'title'> | Omit<PropsWithRetry, 'image' | 'title'>) & {
    title?: string;
};

const ServerError = ({ title, ...props }: ServerErrorProps) => (
    <ScreenBlock title={title || 'Something went wrong'} image={ServerErrorSvg} {...props} />
);

const NotFound = ({ title, message, onBack }: Partial<Pick<ScreenBlockProps, 'title' | 'message' | 'onBack'>>) => (
    <ScreenBlock
        title={title || '404'}
        image={NotFoundSvg}
        message={message || 'The requested resource was not found.'}
        onBack={onBack}
    />
);

export { ServerError, NotFound };
export default ScreenBlock;
