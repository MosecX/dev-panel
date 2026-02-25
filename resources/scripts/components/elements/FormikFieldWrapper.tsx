import React from 'react';
import { Field, FieldProps } from 'formik';
import InputError from '@/components/elements/InputError';
import Label from '@/components/elements/Label';

interface Props {
    id?: string;
    name: string;
    children: React.ReactNode;
    className?: string;
    label?: string;
    description?: string;
    validate?: (value: any) => undefined | string | Promise<any>;
}

const FormikFieldWrapper = ({ id, name, label, className, description, validate, children }: Props) => (
    <Field name={name} validate={validate}>
        {({ field, form: { errors, touched } }: FieldProps) => {
            const hasError = !!(touched[field.name] && errors[field.name]);

            return (
                <div className={`${className || ''} ${hasError ? 'has-error' : ''} mb-4`}>
                    {label && (
                        <Label htmlFor={id} className="text-gray-200 font-medium">
                            {label}
                        </Label>
                    )}
                    {children}
                    <InputError errors={errors} touched={touched} name={field.name}>
                        {description ? (
                            <span
                                className={
                                    hasError
                                        ? 'mt-2 text-sm text-red-400'
                                        : 'mt-2 text-sm text-gray-400'
                                }
                            >
                                {hasError
                                    ? (errors[field.name] as string).charAt(0).toUpperCase() +
                                      (errors[field.name] as string).slice(1)
                                    : description}
                            </span>
                        ) : null}
                    </InputError>
                </div>
            );
        }}
    </Field>
);

export default FormikFieldWrapper;
