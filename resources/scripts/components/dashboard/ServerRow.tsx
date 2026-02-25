import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';

const isAlarmState = (current: number, limit: number): boolean =>
    limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Icon = memo(
    styled(FontAwesomeIcon)<{ $alarm: boolean }>`
        ${(props) => (props.$alarm ? tw`text-red-400` : tw`text-blue-400`)};
        ${tw`text-lg`}
    `,
    isEqual
);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${(props) => (props.$alarm ? tw`text-white` : tw`text-neutral-300`)};
`;

const StatusIndicatorBox = styled(GreyRowBox)<{ $status: ServerPowerState | undefined }>`
    ${tw`relative px-4 py-4 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl shadow-lg w-full gap-4 sm:gap-6`};

    background: rgba(255, 255, 255, 0.08); /* translúcido claro */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
        background: rgba(255, 255, 255, 0.12);
        transform: scale(1.01);
    }

    & .status-bar {
        ${tw`w-1 absolute left-0 z-20 rounded-full opacity-75 transition-all duration-150`};
        height: 100%;

        ${({ $status }) =>
            !$status || $status === 'offline'
                ? tw`bg-red-500`
                : $status === 'running'
                ? tw`bg-green-500`
                : tw`bg-yellow-500`};
    }
`;

type Timer = ReturnType<typeof setInterval>;

export default ({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

    return (
        <StatusIndicatorBox as={Link} to={`/server/${server.id}`} className={className} $status={stats?.status}>
            {/* Nombre y descripción */}
            <div css={tw`flex items-center gap-3 sm:gap-4`}>
                <FontAwesomeIcon icon={faServer} css={tw`text-white text-lg sm:text-xl`} />
                <div>
                    <p css={tw`text-white text-base sm:text-lg font-semibold`}>{server.name}</p>
                    {!!server.description && (
                        <p css={tw`text-xs sm:text-sm text-neutral-400 line-clamp-1`}>{server.description}</p>
                    )}
                </div>
            </div>

            {/* IP */}
            <div css={tw`flex items-center gap-2`}>
                <FontAwesomeIcon icon={faEthernet} css={tw`text-blue-400`} />
                <p css={tw`text-xs sm:text-sm text-neutral-300`}>
                    {server.allocations
                        .filter((alloc) => alloc.isDefault)
                        .map((allocation) => (
                            <React.Fragment key={allocation.ip + allocation.port.toString()}>
                                {allocation.alias || ip(allocation.ip)}:{allocation.port}
                            </React.Fragment>
                        ))}
                </p>
            </div>

            {/* Stats */}
            <div css={tw`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6`}>
                {!stats || isSuspended ? (
                    <span css={tw`bg-red-500 text-red-100 text-xs px-3 py-1 rounded-full`}>
                        {server.status === 'suspended' ? 'Desconectado' : 'Error de conexión'}
                    </span>
                ) : (
                    <>
                        <div css={tw`flex items-center`}>
                            <Icon icon={faMicrochip} $alarm={alarms.cpu} />
                            <IconDescription $alarm={alarms.cpu}>
                                {stats.cpuUsagePercent.toFixed(2)} %
                            </IconDescription>
                            <p css={tw`text-xs text-neutral-400 ml-2`}>de {cpuLimit}</p>
                        </div>
                        <div css={tw`flex items-center`}>
                            <Icon icon={faMemory} $alarm={alarms.memory} />
                            <IconDescription $alarm={alarms.memory}>
                                {bytesToString(stats.memoryUsageInBytes)}
                            </IconDescription>
                            <p css={tw`text-xs text-neutral-400 ml-2`}>de {memoryLimit}</p>
                        </div>
                        <div css={tw`flex items-center`}>
                            <Icon icon={faHdd} $alarm={alarms.disk} />
                            <IconDescription $alarm={alarms.disk}>
                                {bytesToString(stats.diskUsageInBytes)}
                            </IconDescription>
                            <p css={tw`text-xs text-neutral-400 ml-2`}>de {diskLimit}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="status-bar" />
        </StatusIndicatorBox>
    );
};
