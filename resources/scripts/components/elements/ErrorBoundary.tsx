import React from 'react';
import tw from 'twin.macro';
import Icon from '@/components/elements/Icon';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface State {
    hasError: boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
class ErrorBoundary extends React.Component<{}, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error(error);
    }

    render() {
        return this.state.hasError ? (
            <div css={tw`flex items-center justify-center w-full my-6`}>
                <div
                    css={tw`flex items-center rounded-lg p-4 shadow-xl`}
                    className="bg-[rgba(0,0,0,0.75)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-red-400"
                >
                    <Icon icon={faExclamationTriangle} css={tw`h-5 w-auto mr-3 text-red-500`} />
                    <p className="text-sm text-gray-200 font-medium">
                        An error was encountered while rendering this view. Try refreshing the page.
                    </p>
                </div>
            </div>
        ) : (
            this.props.children
        );
    }
}

export default ErrorBoundary;
