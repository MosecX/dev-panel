import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

interface Props {
    hideDropdownArrow?: boolean;
}

const Select = styled.select<Props>`
    ${tw`shadow-none block p-3 pr-8 rounded-md border w-full text-sm transition-all duration-200 ease-in-out`};

    &,
    &:hover:not(:disabled),
    &:focus {
        ${tw`outline-none`};
    }

    -webkit-appearance: none;
    -moz-appearance: none;
    background-size: 1rem;
    background-repeat: no-repeat;
    background-position-x: calc(100% - 0.75rem);
    background-position-y: center;

    &::-ms-expand {
        display: none;
    }

    ${(props) =>
        !props.hideDropdownArrow &&
        css`
            ${tw`bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-neutral-200`};
            backdrop-filter: blur(6px);
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='%23C3D1DF' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3e%3c/svg%3e ");

            &:hover:not(:disabled) {
                ${tw`border-cyan-400 text-cyan-300`};
                box-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
            }

            &:focus {
                ${tw`border-cyan-500 text-cyan-200`};
                box-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
            }
        `};
`;

export default Select;
