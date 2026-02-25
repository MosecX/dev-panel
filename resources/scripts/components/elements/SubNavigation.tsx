import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`
        w-full
        overflow-x-auto
        shadow-md
        rounded-xl
        transition-all duration-300
    `};

    background: linear-gradient(to right, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.7));
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.06);

    & > div {
        ${tw`flex items-center text-sm px-4 py-3 mx-auto gap-2`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`
                inline-block
                py-2 px-4
                text-neutral-300
                font-medium
                no-underline
                whitespace-nowrap
                transition-all duration-200 ease-in-out
                rounded-md
                relative
            `};

            &:hover {
                ${tw`text-white bg-blue-500/5`};
            }

            &:active,
            &.active {
                ${tw`text-white bg-blue-500/10`};
                border-bottom: 2px solid ${theme`colors.cyan.500`.toString()};
                font-weight: 600;
            }
        }
    }
`;

export default SubNavigation;
