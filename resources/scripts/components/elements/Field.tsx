import React, { forwardRef } from 'react';
import { Field as FormikField, FieldProps } from 'formik';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';

interface OwnProps {
    name: string;
    light?: boolean;
    label?: string;
    description?: string;
    validate?: (value: any) => undefined | string | Promise<any>;
}

type Props = OwnProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;

const Field = forwardRef<HTMLInputElement, Props>(
    ({ id, name, light = false, label, description, validate, ...props }, ref) => (
        <FormikField innerRef={ref} name={name} validate={validate}>
            {({ field, form: { errors, touched } }: FieldProps) => (
                <div className="mb-4">
                    {label && (
                        <Label htmlFor={id} isLight={light}>
                            {label}
                        </Label>
                    )}
                    <Input
                        id={id}
                        {...field}
                        {...props}
                        isLight={light}
                        hasError={!!(touched[field.name] && errors[field.name])}
                    />
                    {touched[field.name] && errors[field.name] ? (
                        <p
                            className={
                                'mt-2 text-sm font-medium text-red-400 bg-[rgba(255,0,0,0.1)] backdrop-blur-sm rounded px-2 py-1'
                            }
                        >
                            {(errors[field.name] as string).charAt(0).toUpperCase() +
                                (errors[field.name] as string).slice(1)}
                        </p>
                    ) : description ? (
                        <p
                            className={
                                'mt-2 text-sm text-gray-400 bg-[rgba(255,255,255,0.05)] backdrop-blur-sm rounded px-2 py-1'
                            }
                        >
                            {description}
                        </p>
                    ) : null}
                </div>
            )}
        </FormikField>
    )
);

Field.displayName = 'Field';

export default Field;
