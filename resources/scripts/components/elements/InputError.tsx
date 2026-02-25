import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import tw from 'twin.macro';
import { capitalize } from '@/lib/strings';

interface Props {
    errors: FormikErrors<any>;
    touched: FormikTouched<any>;
    name: string;
    children?: string | number | null | undefined;
}

const InputError = ({ errors, touched, name, children }: Props) =>
    touched[name] && errors[name] ? (
        <p
            css={tw`text-xs pt-2 rounded px-2 py-1`}
            className="text-red-400 bg-[rgba(255,0,0,0.1)] backdrop-blur-sm shadow-sm"
        >
            {typeof errors[name] === 'string'
                ? capitalize(errors[name] as string)
                : capitalize((errors[name] as unknown as string[])[0])}
        </p>
    ) : (
        <>
            {children ? (
                <p
                    css={tw`text-xs pt-2 rounded px-2 py-1`}
                    className="text-gray-400 bg-[rgba(255,255,255,0.05)] backdrop-blur-sm shadow-sm"
                >
                    {children}
                </p>
            ) : null}
        </>
    );

export default InputError;
