import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center justify-center h-full no-underline text-neutral-300 px-2 sm:px-3 cursor-pointer transition-all duration-200 text-base sm:text-lg`};

        &:active,
        &:hover {
            ${tw`text-cyan-300`};
        }

        &:active,
        &:hover,
        &.active {
            box-shadow: inset 0 -2px ${theme`colors.cyan.500`.toString()};
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div
            className={'w-full shadow-md overflow-visible'}
            style={{
                background: 'rgba(17, 24, 39, 0.65)', // translúcido oscuro
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[3.5rem] max-w-[1200px] px-3 sm:px-6'}>
                {/* Logo */}
                <div id={'logo'} className={'flex-1'}>
                    <Link
                        to={'/'}
                        className={
                            'text-lg sm:text-2xl font-header font-semibold no-underline text-neutral-200 hover:text-cyan-300 transition-colors duration-200'
                        }
                    >
                        {name}
                    </Link>
                </div>

                {/* Navegación derecha */}
                <RightNavigation className={'flex h-full items-center justify-center gap-2 sm:gap-4'}>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <span className={'flex items-center w-5 h-5 sm:w-6 sm:h-6'}>
                                <Avatar.User />
                            </span>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button
                            onClick={onTriggerLogout}
                            className="flex items-center justify-center h-full w-5 sm:w-6 text-neutral-300 hover:text-cyan-300 transition-colors duration-200"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </div>
    );
};
