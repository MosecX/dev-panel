import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-flex items-center justify-center rounded-lg px-4 py-2 uppercase tracking-wide text-sm transition-all duration-200 ease-in-out border shadow-md`};

    /* Default / Primary */
    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            ${tw` backdrop-blur-md border-[rgba(255,255,255,0.08)] text-gray-200`};

            &:hover:not(:disabled) {
                ${tw`text-cyan-300 border-cyan-400`};
            }

            &:active:not(:disabled) {
                ${tw`scale-[0.97]`};
            }
        `};

    /* Grey */
    ${(props) =>
        props.color === 'grey' &&
        css`
            ${tw`bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.08)] text-gray-300`};

            &:hover:not(:disabled) {
                ${tw`text-white border-cyan-400`};
            }
        `};

    /* Green */
    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            ${tw`bg-green-600/30 border-green-500/40 text-green-300`};

            &:hover:not(:disabled) {
                ${tw`bg-green-600/50 text-green-200`};
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        ${tw`bg-green-600/40 border-green-500/50`};
                    }
                `};
        `};

    /* Red */
    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            ${tw`bg-red-600/30 border-red-500/40 text-red-300`};

            &:hover:not(:disabled) {
                ${tw`bg-red-600/50 text-red-200`};
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        ${tw`bg-red-600/40 border-red-500/50`};
                    }
                `};
        `};

    /* Sizes */
    ${(props) => props.size === 'xsmall' && tw`px-2 py-1 text-xs`};
    ${(props) => (!props.size || props.size === 'small') && tw`px-4 py-2 text-sm`};
    ${(props) => props.size === 'large' && tw`px-6 py-3 text-base`};
    ${(props) => props.size === 'xlarge' && tw`px-6 py-3 w-full text-lg`};

    /* Secondary variant */
    ${(props) =>
        props.isSecondary &&
        css<Props>`
            ${tw`bg-transparent border-[rgba(255,255,255,0.12)] text-gray-300`};

            &:hover:not(:disabled) {
                ${tw`text-white border-cyan-400`};
                ${(props) => props.color === 'red' && tw`bg-red-600/30 text-red-300`};
                ${(props) => props.color === 'primary' && tw`bg-cyan-600/30 text-cyan-300`};
                ${(props) => props.color === 'green' && tw`bg-green-600/30 text-green-300`};
            }
        `};

    &:disabled {
        ${tw`opacity-50 cursor-not-allowed`};
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
