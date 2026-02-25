import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div
        css={tw`
            rounded-xl shadow-lg
            bg-[rgba(255,255,255,0.05)]
            backdrop-blur-md
            border border-[rgba(255,255,255,0.12)]
            transition-all duration-300 ease-in-out
            hover:border-cyan-400
        `}
        className={className}
        style={{
            transition: 'box-shadow 0.3s ease-in-out',
        }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 4px 12px rgba(34, 211, 238, 0.3)'; // sombra cyan manual
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        }}
    >
        <div
            css={tw`
                rounded-t-xl p-3 border-b
                bg-[rgba(255,255,255,0.08)]
                backdrop-blur-sm
                border-[rgba(255,255,255,0.1)]
                flex items-center
            `}
        >
            {typeof title === 'string' ? (
                <p css={tw`text-sm uppercase text-neutral-200 tracking-wide flex items-center`}>
                    {icon && (
                        <FontAwesomeIcon
                            icon={icon}
                            css={tw`mr-2 text-cyan-300 transition-transform duration-200 hover:rotate-12`}
                        />
                    )}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div
            css={tw`
                p-4 text-neutral-200
                transition-all duration-300
                hover:text-neutral-100
            `}
        >
            {children}
        </div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
