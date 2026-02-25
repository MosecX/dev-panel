import React from 'react';
import { PaginatedResult } from '@/api/http';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import Button from '@/components/elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

interface RenderFuncProps<T> {
    items: T[];
    isLastPage: boolean;
    isFirstPage: boolean;
}

interface Props<T> {
    data: PaginatedResult<T>;
    showGoToLast?: boolean;
    showGoToFirst?: boolean;
    onPageSelect: (page: number) => void;
    children: (props: RenderFuncProps<T>) => React.ReactNode;
}

const Block = styled(Button)`
    ${tw`p-0 w-10 h-10 rounded-md transition-all duration-200 ease-in-out`};

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #e2e8f0;

    &:hover:not(:disabled) {
        background: rgba(34, 211, 238, 0.25); /* cyan-400 translúcido */
        border-color: #22d3ee;
        color: #22d3ee;
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);
    }

    &:not(:last-of-type) {
        ${tw`mr-2`};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

function Pagination<T>({ data: { items, pagination }, onPageSelect, children }: Props<T>) {
    const isFirstPage = pagination.currentPage === 1;
    const isLastPage = pagination.currentPage >= pagination.totalPages;

    const pages = [];

    // Start two spaces before the current page. If that puts us before the starting page default
    // to the first page as the starting point.
    const start = Math.max(pagination.currentPage - 2, 1);
    const end = Math.min(pagination.totalPages, pagination.currentPage + 5);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <>
            {children({ items, isFirstPage, isLastPage })}
            {pages.length > 1 && (
                <div css={tw`mt-6 flex justify-center`}>
                    {pages[0] > 1 && !isFirstPage && (
                        <Block isSecondary color={'primary'} onClick={() => onPageSelect(1)}>
                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                        </Block>
                    )}
                    {pages.map((i) => (
                        <Block
                            isSecondary={pagination.currentPage !== i}
                            color={'primary'}
                            key={`block_page_${i}`}
                            onClick={() => onPageSelect(i)}
                        >
                            {i}
                        </Block>
                    ))}
                    {pages[pages.length - 1] < pagination.totalPages && !isLastPage && (
                        <Block isSecondary color={'primary'} onClick={() => onPageSelect(pagination.totalPages)}>
                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                        </Block>
                    )}
                </div>
            )}
        </>
    );
}

export default Pagination;
