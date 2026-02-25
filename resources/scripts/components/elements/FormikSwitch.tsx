import React from 'react';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import { Field, FieldProps } from 'formik';
import Switch, { SwitchProps } from '@/components/elements/Switch';

const FormikSwitch = ({ name, label, ...props }: SwitchProps) => {
    return (
        <FormikFieldWrapper name={name}>
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <Switch
                        name={name}
                        label={label}
                        onChange={() => {
                            form.setFieldTouched(name);
                            form.setFieldValue(field.name, !field.value);
                        }}
                        defaultChecked={field.value}
                        className="transition-all duration-200 ease-in-out 
                                   bg-[rgba(0,0,0,0.6)] backdrop-blur-md 
                                   border border-[rgba(255,255,255,0.08)] 
                                   rounded-lg shadow-md 
                                   checked:bg-cyan-600 checked:border-cyan-400 
                                   hover:border-cyan-400 hover:shadow-lg"
                        {...props}
                    />
                )}
            </Field>
        </FormikFieldWrapper>
    );
};

export default FormikSwitch;
