import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { v4 } from 'uuid';
import tw from 'twin.macro';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';

const ToggleContainer = styled.div`
    ${tw`relative select-none w-12 leading-normal`};

    & > input[type='checkbox'] {
        ${tw`hidden`};

        &:checked + label {
            ${tw`bg-cyan-600 border-cyan-400 shadow-lg`};
        }

        &:checked + label:before {
            right: 0.125rem;
            background: linear-gradient(135deg, #22d3ee, #67e8f9);
            box-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
        }
    }

    & > label {
        ${tw`mb-0 block overflow-hidden cursor-pointer bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.2)] rounded-full h-6 shadow-inner relative`};
        transition: all 200ms ease-in-out;
        backdrop-filter: blur(6px);

        &::before {
            ${tw`absolute block border h-5 w-5 rounded-full`};
            top: 0.125rem;
            right: calc(50% + 0.125rem);
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
            content: '';
            transition: all 200ms ease-in-out;
        }

        &:hover {
            border-color: #22d3ee;
            box-shadow: 0 0 10px rgba(34, 211, 238, 0.4);
        }
    }
`;

export interface SwitchProps {
    name: string;
    label?: string;
    description?: string;
    defaultChecked?: boolean;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
}

const Switch = ({ name, label, description, defaultChecked, readOnly, onChange, children }: SwitchProps) => {
    const uuid = useMemo(() => v4(), []);

    return (
        <div css={tw`flex items-center`}>
            <ToggleContainer css={tw`flex-none`}>
                {children || (
                    <Input
                        id={uuid}
                        name={name}
                        type="checkbox"
                        onChange={(e) => onChange && onChange(e)}
                        defaultChecked={defaultChecked}
                        disabled={readOnly}
                    />
                )}
                <Label htmlFor={uuid} />
            </ToggleContainer>
            {(label || description) && (
                <div css={tw`ml-4 w-full`}>
                    {label && (
                        <Label css={[tw`cursor-pointer`, !!description && tw`mb-0`]} htmlFor={uuid}>
                            {label}
                        </Label>
                    )}
                    {description && (
                        <p css={tw`text-neutral-400 text-sm mt-2`}>{description}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Switch;
