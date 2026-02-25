import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && (
            <h2
                css={tw`mb-4 px-4 text-2xl font-semibold`}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
                {title}
            </h2>
        )}
        {showFlashes && (
            <FlashMessageRender
                byKey={typeof showFlashes === 'string' ? showFlashes : undefined}
                css={tw`mb-4`}
            />
        )}
        <div        >
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </div>
    </div>
);

export default ContentBox;
