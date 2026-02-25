import React from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import classNames from 'classnames';

interface Props {
    cron: Schedule['cron'];
    className?: string;
}

const ScheduleCronRow = ({ cron, className }: Props) => (
    <div
        className={classNames(
            'flex justify-between gap-4 p-4 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-md',
            className
        )}
    >
        <div className="flex-1 text-center">
            <p className="font-mono text-blue-300 font-semibold">{cron.minute}</p>
            <p className="text-2xs text-neutral-400 uppercase">Minute</p>
        </div>
        <div className="flex-1 text-center">
            <p className="font-mono text-indigo-300 font-semibold">{cron.hour}</p>
            <p className="text-2xs text-neutral-400 uppercase">Hour</p>
        </div>
        <div className="flex-1 text-center">
            <p className="font-mono text-green-300 font-semibold">{cron.dayOfMonth}</p>
            <p className="text-2xs text-neutral-400 uppercase">Day (Month)</p>
        </div>
        <div className="flex-1 text-center">
            <p className="font-mono text-yellow-300 font-semibold">{cron.month}</p>
            <p className="text-2xs text-neutral-400 uppercase">Month</p>
        </div>
        <div className="flex-1 text-center">
            <p className="font-mono text-red-300 font-semibold">{cron.dayOfWeek}</p>
            <p className="text-2xs text-neutral-400 uppercase">Day (Week)</p>
        </div>
    </div>
);

export default ScheduleCronRow;
