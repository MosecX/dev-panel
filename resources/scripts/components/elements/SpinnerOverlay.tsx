import React from 'react';
import Spinner, { SpinnerSize } from '@/components/elements/Spinner';
import Fade from '@/components/elements/Fade';
import tw from 'twin.macro';

interface Props {
    visible: boolean;
    fixed?: boolean;
    size?: SpinnerSize;
    backgroundOpacity?: number;
}

const SpinnerOverlay: React.FC<Props> = ({ size, fixed, visible, backgroundOpacity, children }) => (
    <Fade timeout={200} in={visible} unmountOnExit>
        <div
            css={[
                tw`top-0 left-0 flex items-center justify-center w-full h-full flex-col z-50 transition-all duration-300`,
                !fixed ? tw`absolute` : tw`fixed`,
            ]}
            className="backdrop-blur-md rounded-lg"
            style={{
                background: `rgba(0, 0, 0, ${backgroundOpacity ?? 0.45})`,
            }}
        >
            <Spinner size={size} />
            {children &&
                (typeof children === 'string' ? (
                    <p
                        css={tw`mt-4 text-sm`}
                        className="text-neutral-300 animate-fade-in"
                    >
                        {children}
                    </p>
                ) : (
                    children
                ))}
        </div>
    </Fade>
);

export default SpinnerOverlay;
