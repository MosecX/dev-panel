import React from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import tw from 'twin.macro';
import ScheduleCronRow from '@/components/server/schedules/ScheduleCronRow';

export default ({ schedule }: { schedule: Schedule }) => (
    <div
        className="animate-fade-in"
        css={tw`
            flex flex-wrap items-center 
            p-4 rounded-xl 
            border border-[rgba(255,255,255,0.08)] 
            bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
            shadow-md transition-all duration-300 hover:scale-[1.01] mb-4
        `}
    >
        {/* Icon */}
        <div css={tw`hidden md:block text-blue-300`}>
            <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
        </div>

        {/* Name + Last run */}
        <div css={tw`flex-1 md:ml-4`}>
            <p css={tw`text-neutral-100 font-semibold`}>{schedule.name}</p>
            <p css={tw`text-xs text-neutral-400`}>
                Last run at:{' '}
                {schedule.lastRunAt ? format(schedule.lastRunAt, "MMM do 'at' h:mma") : 'never'}
            </p>
        </div>

        {/* Divider */}
        <div css={tw`hidden sm:block border-l border-neutral-700 mx-4 h-10`} />

        {/* Cron row */}
        <ScheduleCronRow
            cron={schedule.cron}
            css={tw`mx-auto sm:mx-8 w-full sm:w-auto mt-4 sm:mt-0`}
        />

        {/* Status pill (mobile) */}
        <div className="sm:hidden mt-4 w-full text-right">
            <span
                className={`
                    py-1 px-3 rounded-full text-xs uppercase font-semibold 
                    transition-colors duration-200
                    ${schedule.isActive ? 'bg-[rgba(34,197,94,0.2)] border border-green-400/40 text-green-300 backdrop-blur-md' : 'bg-[rgba(156,163,175,0.2)] border border-neutral-400/40 text-neutral-300 backdrop-blur-md'}
                `}
            >
                {schedule.isActive ? 'Active' : 'Inactive'}
            </span>
        </div>

        {/* Status pill (desktop) */}
        <div className="hidden sm:block">
            <span
                className={`
                    py-1 px-3 rounded-full text-xs uppercase font-semibold 
                    transition-colors duration-200
                    ${schedule.isProcessing 
                        ? 'bg-[rgba(156,163,175,0.2)] border border-neutral-400/40 text-neutral-300 backdrop-blur-md' 
                        : schedule.isActive 
                            ? 'bg-[rgba(34,197,94,0.2)] border border-green-400/40 text-green-300 backdrop-blur-md' 
                            : 'bg-[rgba(156,163,175,0.2)] border border-neutral-400/40 text-neutral-300 backdrop-blur-md'}
                `}
            >
                {schedule.isProcessing ? 'Processing' : schedule.isActive ? 'Active' : 'Inactive'}
            </span>
        </div>
    </div>
);
