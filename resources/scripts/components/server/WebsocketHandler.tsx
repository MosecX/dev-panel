import React, { useEffect, useState, useRef } from 'react';
import { Websocket } from '@/plugins/Websocket';
import { ServerContext } from '@/state/server';
import getWebsocketToken from '@/api/server/getWebsocketToken';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import tw from 'twin.macro';

const reconnectErrors = ['jwt: exp claim is invalid', 'jwt: created too far in past (denylist)'];

export default () => {
    const updatingToken = useRef(false);
    const [error, setError] = useState<'connecting' | string>('');
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid ?? '');
    const setServerStatus = ServerContext.useStoreActions((actions) => actions.status.setServerStatus);
    const { setInstance, setConnectionState } = ServerContext.useStoreActions((actions) => actions.socket);

    const updateToken = (uuid: string, socket: Websocket) => {
        if (updatingToken.current) return;
        updatingToken.current = true;

        getWebsocketToken(uuid)
            .then((data) => socket.setToken(data.token, true))
            .catch((err) => console.error('Token update failed:', err))
            .finally(() => {
                updatingToken.current = false;
            });
    };

    const connect = (uuid: string) => {
        const socket = new Websocket();

        socket.on('auth success', () => setConnectionState(true));
        socket.on('SOCKET_CLOSE', () => setConnectionState(false));
        socket.on('SOCKET_ERROR', () => {
            setError('connecting');
            setConnectionState(false);
        });
        socket.on('status', (status) => setServerStatus(status));

        socket.on('daemon error', (message) => {
            console.warn('Daemon socket error:', message);
        });

        socket.on('token expiring', () => updateToken(uuid, socket));
        socket.on('token expired', () => updateToken(uuid, socket));
        socket.on('jwt error', (err: string) => {
            setConnectionState(false);
            console.warn('JWT validation error:', err);

            if (reconnectErrors.some((v) => err.toLowerCase().includes(v))) {
                updateToken(uuid, socket);
            } else {
                setError('There was an error validating the websocket credentials. Please refresh the page.');
            }
        });

        socket.on('transfer status', (status: string) => {
            if (status === 'starting' || status === 'success') return;
            socket.close();
            setError('connecting');
            setConnectionState(false);
            setInstance(null);
            connect(uuid);
        });

        getWebsocketToken(uuid)
            .then((data) => {
                socket.setToken(data.token).connect(data.socket);
                setInstance(socket);
            })
            .catch((err) => console.error('Websocket connection failed:', err));
    };

    useEffect(() => {
        if (connected) setError('');
    }, [connected]);

    useEffect(() => {
        return () => {
            instance?.close();
        };
    }, [instance]);

    useEffect(() => {
        if (instance || !uuid) return;
        connect(uuid);
    }, [uuid]);

    return error ? (
        <CSSTransition timeout={150} in appear classNames="fade">
            <div css={tw`bg-red-500 py-2`}>
                <ContentContainer css={tw`flex items-center justify-center`}>
                    {error === 'connecting' ? (
                        <>
                            <Spinner size="small" />
                            <p css={tw`ml-2 text-sm text-red-100`}>
                                We&apos;re having some trouble connecting to your server, please wait...
                            </p>
                        </>
                    ) : (
                        <p css={tw`ml-2 text-sm text-white`}>{error}</p>
                    )}
                </ContentContainer>
            </div>
        </CSSTransition>
    ) : null;
};
