import React, { memo, useCallback } from 'react';
import { useField } from 'formik';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import isEqual from 'react-fast-compare';

interface Props {
    isEditable: boolean;
    title: string;
    permissions: string[];
    className?: string;
}

const PermissionTitleBox: React.FC<Props> = memo(
    ({ isEditable, title, permissions, className, children }) => {
        const [{ value }, , { setValue }] = useField<string[]>('permissions');

        const onCheckboxClicked = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.currentTarget.checked) {
                    setValue([...value, ...permissions.filter((p) => !value.includes(p))]);
                } else {
                    setValue(value.filter((p) => !permissions.includes(p)));
                }
            },
            [permissions, value]
        );

        return (
            <TitledGreyBox
                title={
                    <div
                        css={tw`
                            flex items-center 
                            rounded-lg border-b border-[rgba(255,255,255,0.08)] 
                            bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
                            p-3 shadow-md
                        `}
                    >
                        <p css={tw`text-sm uppercase flex-1 text-neutral-100 font-semibold`}>
                            {title}
                        </p>
                        {isEditable && (
                            <Input
                                type={'checkbox'}
                                checked={permissions.every((p) => value.includes(p))}
                                onChange={onCheckboxClicked}
                                css={tw`
                                    w-5 h-5 rounded-md border border-neutral-600 
                                    bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
                                    transition-colors duration-200
                                    hover:border-blue-400 hover:bg-[rgba(59,130,246,0.15)]
                                `}
                            />
                        )}
                    </div>
                }
                className={className}
            >
                {children}
            </TitledGreyBox>
        );
    },
    isEqual
);

export default PermissionTitleBox;
