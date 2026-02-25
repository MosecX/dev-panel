import React from 'react';
import { PaginationDataSet } from '@/api/http';
import classNames from 'classnames';
import { Button } from '@/components/elements/button/index';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';

interface Props {
    className?: string;
    pagination: PaginationDataSet;
    onPageSelect: (page: number) => void;
}

const PaginationFooter = ({ pagination, className, onPageSelect }: Props) => {
    const start = (pagination.currentPage - 1) * pagination.perPage;
    const end = (pagination.currentPage - 1) * pagination.perPage + pagination.count;

    const { currentPage: current, totalPages: total } = pagination;

    const pages = { previous: [] as number[], next: [] as number[] };
    for (let i = 1; i <= 2; i++) {
        if (current - i >= 1) {
            pages.previous.push(current - i);
        }
        if (current + i <= total) {
            pages.next.push(current + i);
        }
    }

    if (pagination.total === 0) {
        return null;
    }

    const buttonProps = (page: number) => ({
        size: Button.Sizes.Small,
        shape: Button.Shapes.IconSquare,
        variant: Button.Variants.Secondary,
        onClick: () => onPageSelect(page),
        className:
            'bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-gray-200 ' +
            'hover:text-cyan-300 hover:border-cyan-400 transition-all duration-200 ease-in-out',
    });

    return (
        <div
            className={classNames(
                'flex items-center justify-between my-3 px-4 py-2 rounded-lg shadow-md',
                'bg-[rgba(0,0,0,0.4)] backdrop-blur-md border border-[rgba(255,255,255,0.08)]',
                className
            )}
        >
            <p className={'text-sm text-gray-400'}>
                Showing&nbsp;
                <span className={'font-semibold text-gray-200'}>
                    {Math.max(start, Math.min(pagination.total, 1))}
                </span>
                &nbsp;to&nbsp;
                <span className={'font-semibold text-gray-200'}>{end}</span> of&nbsp;
                <span className={'font-semibold text-gray-200'}>{pagination.total}</span> results.
            </p>
            {pagination.totalPages > 1 && (
                <div className={'flex space-x-1'}>
                    <Button.Text {...buttonProps(1)} disabled={pages.previous.length !== 2}>
                        <ChevronDoubleLeftIcon className={'w-3 h-3'} />
                    </Button.Text>
                    {pages.previous.reverse().map((value) => (
                        <Button.Text key={`previous-${value}`} {...buttonProps(value)}>
                            {value}
                        </Button.Text>
                    ))}
                    <Button
                        size={Button.Sizes.Small}
                        shape={Button.Shapes.IconSquare}
                        className={
                            'bg-cyan-600/30 text-cyan-300 border border-cyan-400/40 shadow-md ' +
                            'hover:bg-cyan-600/50 hover:text-white active:scale-[0.97]'
                        }
                    >
                        {current}
                    </Button>
                    {pages.next.map((value) => (
                        <Button.Text key={`next-${value}`} {...buttonProps(value)}>
                            {value}
                        </Button.Text>
                    ))}
                    <Button.Text {...buttonProps(total)} disabled={pages.next.length !== 2}>
                        <ChevronDoubleRightIcon className={'w-3 h-3'} />
                    </Button.Text>
                </div>
            )}
        </div>
    );
};

export default PaginationFooter;
