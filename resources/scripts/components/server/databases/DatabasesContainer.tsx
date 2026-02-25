import React, { useEffect, useState } from 'react';
import getServerDatabases from '@/api/server/databases/getServerDatabases';
import { ServerContext } from '@/state/server';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import DatabaseRow from '@/components/server/databases/DatabaseRow';
import Spinner from '@/components/elements/Spinner';
import CreateDatabaseButton from '@/components/server/databases/CreateDatabaseButton';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import Fade from '@/components/elements/Fade';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import './animations.css';

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const databaseLimit = ServerContext.useStoreState((state) => state.server.data!.featureLimits.databases);

    const { addError, clearFlashes } = useFlash();
    const [loading, setLoading] = useState(true);

    const databases = useDeepMemoize(ServerContext.useStoreState((state) => state.databases.data));
    const setDatabases = ServerContext.useStoreActions((state) => state.databases.setDatabases);

    useEffect(() => {
        setLoading(!databases.length);
        clearFlashes('databases');

        getServerDatabases(uuid)
            .then((databases) => setDatabases(databases))
            .catch((error) => {
                console.error(error);
                addError({ key: 'databases', message: httpErrorToHuman(error) });
            })
            .then(() => setLoading(false));
    }, []);

    return (
        <ServerContentBlock
            title={'Databases'}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)] shadow-2xl p-6"
        >
            <FlashMessageRender byKey={'databases'} className="mb-4" />
            {!databases.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <Fade timeout={150}>
                    <>
                        {databases.length > 0 ? (
                            <div className="animate-stagger">
                                {databases.map((database, index) => (
                                    <DatabaseRow
                                        key={database.id}
                                        database={database}
                                        className={index > 0 ? 'mt-1 animate-fade-in' : 'animate-fade-in'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-neutral-300">
                                {databaseLimit > 0
                                    ? 'It looks like you have no databases.'
                                    : 'Databases cannot be created for this server.'}
                            </p>
                        )}
                        <Can action={'database.create'}>
                            <div className="mt-6 flex items-center justify-end animate-slide-up">
                                {databaseLimit > 0 && databases.length > 0 && (
                                    <p className="text-sm text-neutral-300 mb-4 sm:mr-6 sm:mb-0">
                                        {databases.length} of {databaseLimit} databases have been allocated to this
                                        server.
                                    </p>
                                )}
                                {databaseLimit > 0 && databaseLimit !== databases.length && (
                                    <CreateDatabaseButton className="flex justify-end mt-6" />
                                )}
                            </div>
                        </Can>
                    </>
                </Fade>
            )}
        </ServerContentBlock>
    );
};
