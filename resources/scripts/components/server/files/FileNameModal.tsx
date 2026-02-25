import React from 'react';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import { ServerContext } from '@/state/server';
import { join } from 'path';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

type Props = RequiredModalProps & {
    onFileNamed: (name: string) => void;
};

interface Values {
    fileName: string;
}

export default ({ onFileNamed, onDismissed, ...props }: Props) => {
    const directory = ServerContext.useStoreState((state) => state.files.directory);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        onFileNamed(join(directory, values.fileName));
        setSubmitting(false);
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{ fileName: '' }}
            validationSchema={object().shape({
                fileName: string().required().min(1),
            })}
        >
            {({ resetForm }) => (
                <Modal
                    onDismissed={() => {
                        resetForm();
                        onDismissed();
                    }}
                    {...props}
                    className="rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)] shadow-2xl p-6"
                >
                    <Form>
                        <Field
                            id={'fileName'}
                            name={'fileName'}
                            label={'File Name'}
                            description={'Enter the name that this file should be saved as.'}
                            autoFocus
                            className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] backdrop-blur-md text-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                        />
                        <div css={tw`mt-6 text-right`}>
                            <Button
                                className="rounded-lg border border-cyan-400/40 bg-[rgba(255,255,255,0.08)] backdrop-blur-md text-cyan-300 hover:border-cyan-300 hover:text-white transition-all duration-300"
                            >
                                Create File
                            </Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
};
