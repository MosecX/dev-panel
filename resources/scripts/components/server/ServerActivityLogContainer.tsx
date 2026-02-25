import React, { useEffect, useState } from 'react';
import { useActivityLogs } from '@/api/server/activity';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useFlashKey } from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import Spinner from '@/components/elements/Spinner';
import ActivityLogEntry from '@/components/elements/activity/ActivityLogEntry';
import PaginationFooter from '@/components/elements/table/PaginationFooter';
import { ActivityLogFilters } from '@/api/account/activity';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { styles as btnStyles } from '@/components/elements/button/index';
import { XCircleIcon } from '@heroicons/react/solid';
import useLocationHash from '@/plugins/useLocationHash';
import tw from 'twin.macro';

export default () => {
    const { hash } = useLocationHash();
    const { clearAndAddHttpError } = useFlashKey('server:activity');
    const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, sorts: { timestamp: -1 } });

    const { data, isValidating, error } = useActivityLogs(filters, {
        revalidateOnMount: true,
        revalidateOnFocus: false,
    });

    useEffect(() => {
        setFilters((value) => ({ ...value, filters: { ip: hash.ip, event: hash.event } }));
    }, [hash]);

    useEffect(() => {
        clearAndAddHttpError(error);
    }, [error]);

    return (
        <ServerContentBlock
            title={'Activity Log'}
            css={tw`
                rounded-xl border border-[rgba(255,255,255,0.08)]
                bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-lg p-6
            `}
        >
            <FlashMessageRender byKey={'server:activity'} css={tw`mb-4`} />

            {(filters.filters?.event || filters.filters?.ip) && (
                <div css={tw`flex justify-end mb-2`}>
                    <Link
                        to={'#'}
                        className={classNames(
                            btnStyles.button,
                            btnStyles.text,
                            'w-full sm:w-auto flex items-center justify-center rounded-lg border border-purple-400/40 bg-[rgba(168,85,247,0.15)] backdrop-blur-md text-purple-300 shadow-md transition hover:scale-105 hover:border-purple-400 hover:text-purple-200'
                        )}
                        onClick={() => setFilters((value) => ({ ...value, filters: {} }))}
                    >
                        Clear Filters <XCircleIcon className={'w-4 h-4 ml-2'} />
                    </Link>
                </div>
            )}

            {!data && isValidating ? (
                <Spinner centered />
            ) : !data?.items.length ? (
                <p css={tw`text-sm text-center text-neutral-400`}>
                    No activity logs available for this server.
                </p>
            ) : (
                <div
                    css={tw`
                        rounded-lg border border-[rgba(255,255,255,0.08)]
                        bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-inner
                        divide-y divide-[rgba(255,255,255,0.08)]
                    `}
                >
                    {data?.items.map((activity) => (
                        <ActivityLogEntry key={activity.id} activity={activity}>
                            <span />
                        </ActivityLogEntry>
                    ))}
                </div>
            )}

            {data && (
                <PaginationFooter
                    pagination={data.pagination}
                    onPageSelect={(page) => setFilters((value) => ({ ...value, page }))}
                />
            )}
        </ServerContentBlock>
    );
};
