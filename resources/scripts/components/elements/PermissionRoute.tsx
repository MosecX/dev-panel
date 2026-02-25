import React from 'react';
import { Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import Can from '@/components/elements/Can';
import { ServerError } from '@/components/elements/ScreenBlock';

interface Props extends Omit<RouteProps, 'path'> {
    path: string;
    permission: string | string[] | null;
}

const SecureRoute: React.FC<Props> = ({ permission, children, ...props }) => (
    <Route {...props}>
        {!permission ? (
            children
        ) : (
            <Can
                matchAny
                action={permission}
                renderOnError={
                    <ServerError
                        title="Access Denied"
                        message="🚫 You do not have permission to access this page. Please contact an administrator if you believe this is an error."
                    />
                }
            >
                {children}
            </Can>
        )}
    </Route>
);

export default SecureRoute;
