import React, { CSSProperties } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import classNames from 'classnames';

interface Props {
    icon: IconDefinition;
    className?: string;
    style?: CSSProperties;
    color?: string; // opcional para personalizar color
    size?: number;  // opcional para personalizar tamaño
}

const Icon = ({ icon, className, style, color, size }: Props) => {
    const [width, height, , , paths] = icon.icon;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            css={tw`inline-block transition-transform duration-200 ease-in-out`}
            className={classNames('fill-current', className)}
            style={{
                ...style,
                color: color || 'currentColor',
                width: size || width,
                height: size || height,
            }}
        >
            {(Array.isArray(paths) ? paths : [paths]).map((path, index) => (
                <path key={`svg_path_${index}`} d={path} />
            ))}
        </svg>
    );
};

export default Icon;
