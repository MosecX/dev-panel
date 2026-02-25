import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`
        flex 
        rounded-xl 
        no-underline 
        text-neutral-200 
        items-center 
        p-4 
        border 
        border-transparent 
        transition-all 
        duration-200 
        ease-in-out
        overflow-visible
        relative
        z-0
    `};

    /* Fondo translúcido + blur */
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

    ${(props) => props.$hoverable !== false && tw`hover:border-neutral-500`};

    & .icon {
        ${tw`
            rounded-full 
            w-16 
            flex 
            items-center 
            justify-center 
            bg-neutral-500/60 
            p-3
        `};
        backdrop-filter: blur(4px);
    }
`;
