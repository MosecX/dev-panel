import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { NavLink, useLocation } from 'react-router-dom';
import { encodePathSegments, hashToPath } from '@/helpers';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

interface Props {
    renderLeft?: JSX.Element;
    withinFileEditor?: boolean;
    isNewFile?: boolean;
}

export default ({ renderLeft, withinFileEditor, isNewFile }: Props) => {
    const [file, setFile] = useState<string | null>(null);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { hash } = useLocation();

    useEffect(() => {
        const path = hashToPath(hash);

        if (withinFileEditor && !isNewFile) {
            const name = path.split('/').pop() || null;
            setFile(name);
        }
    }, [withinFileEditor, isNewFile, hash]);

    const breadcrumbs = (): { name: string; path?: string }[] =>
        directory
            .split('/')
            .filter((directory) => !!directory)
            .map((directory, index, dirs) => {
                if (!withinFileEditor && index === dirs.length - 1) {
                    return { name: directory };
                }

                return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
            });

    return (
        <div
            className="flex flex-grow-0 items-center text-sm overflow-x-hidden rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-md bg-[rgba(255,255,255,0.05)] shadow-md px-3 py-2"
        >
            {renderLeft || <div className="w-12" />}
            <span className="px-1 text-gray-300">/home</span>/
            <NavLink
                to={`/server/${id}/files`}
                className="px-1 text-cyan-300 no-underline hover:text-white transition-all duration-300 ease-in-out"
            >
                <FontAwesomeIcon icon={faFolderOpen} className="mr-1 text-cyan-400" />
                container
            </NavLink>
            /
            {breadcrumbs().map((crumb, index) =>
                crumb.path ? (
                    <React.Fragment key={index}>
                        <NavLink
                            to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                            className="px-1 text-cyan-300 no-underline hover:text-white transition-all duration-300 ease-in-out"
                        >
                            <FontAwesomeIcon icon={faFolderOpen} className="mr-1 text-cyan-400" />
                            {crumb.name}
                        </NavLink>
                        /
                    </React.Fragment>
                ) : (
                    <span key={index} className="px-1 text-gray-400">
                        {crumb.name}
                    </span>
                )
            )}
            {file && (
                <React.Fragment>
                    <span className="px-1 text-gray-400">{file}</span>
                </React.Fragment>
            )}
        </div>
    );
};
