import React, { useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@/components/server/console/chart';
import { hexToRgba } from '@/lib/helpers';
import { bytesToString } from '@/lib/formatters';
import { CloudDownloadIcon, CloudUploadIcon } from '@heroicons/react/solid';
import { theme } from 'twin.macro';
import ChartBlock from '@/components/server/console/ChartBlock';
import Tooltip from '@/components/elements/tooltip/Tooltip';

export default () => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 2);
    const memory = useChartTickLabel('Memory', limits.memory, 'MiB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            elements: {
                line: {
                    borderWidth: 2,
                    tension: 0.3,
                },
                point: {
                    radius: 2,
                    hoverRadius: 4,
                },
            },
            scales: {
                y: {
                    ticks: {
                        color: '#e5e7eb', // gris claro
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                    },
                    grid: {
                        color: '#374151', // gris oscuro
                    },
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' },
                },
            },
        },
        callback(opts, index) {
            return {
                ...opts,
                label: !index ? 'Network In' : 'Network Out',
                borderColor: !index ? theme('colors.cyan.400') : theme('colors.yellow.400'),
                backgroundColor: hexToRgba(!index ? theme('colors.cyan.700') : theme('colors.yellow.700'), 0.4),
            };
        },
    });

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    return (
        <>
            <ChartBlock
                title={'CPU Load'}
                className="rounded-xl shadow-xl p-4 border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)]"
            >
                <Line {...cpu.props} />
            </ChartBlock>

            <ChartBlock
                title={'Memory'}
                className="rounded-xl shadow-xl p-4 border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)]"
            >
                <Line {...memory.props} />
            </ChartBlock>

            <ChartBlock
                title={'Network'}
                className="rounded-xl shadow-xl p-4 border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)]"
                legend={
                    <div className="flex items-center gap-3">
                        <Tooltip arrow content={'Inbound'}>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full backdrop-blur-md bg-[rgba(255,255,255,0.08)] ring-1 ring-yellow-400/40">
                                <CloudDownloadIcon className="w-4 h-4 text-yellow-400" />
                            </div>
                        </Tooltip>
                        <Tooltip arrow content={'Outbound'}>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full backdrop-blur-md bg-[rgba(255,255,255,0.08)] ring-1 ring-cyan-400/40">
                                <CloudUploadIcon className="w-4 h-4 text-cyan-400" />
                            </div>
                        </Tooltip>
                    </div>
                }
            >
                <Line {...network.props} />
            </ChartBlock>
        </>
    );
};
