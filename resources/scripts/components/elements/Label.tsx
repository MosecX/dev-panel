import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean }>`
    ${tw`block text-xs uppercase mb-1 sm:mb-2 select-none transition-all duration-300 ease-in-out`};

    /* Color base */
    color: rgba(255, 255, 255, 0.7);

    /* Si es light, cambia a un tono más oscuro */
    ${(props) => props.isLight && tw`text-neutral-700`};

    /* Hover suave con efecto premium */
    &:hover {
        color: #22d3ee; /* cyan-400 */
        text-shadow: 0 0 6px rgba(34, 211, 238, 0.6);
        transform: translateY(-1px);
    }

    /* Pequeño glow cuando está enfocado el input asociado */
    &:focus-within {
        color: #38bdf8; /* cyan-300 */
        text-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
    }
`;

export default Label;
