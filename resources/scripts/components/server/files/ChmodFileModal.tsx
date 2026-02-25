import { fileBitsToString } from '@/helpers';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import React from 'react';
import Modal, { RequiredModalProps } from '@/components/elements/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import chmodFiles from '@/api/server/files/chmodFiles';
import { ServerContext } from '@/state/server';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import useFlash from '@/plugins/useFlash';

interface FormikValues {
    mode: string;
}

interface File {
    file: string;
    mode: string;
}

type OwnProps = RequiredModalProps & { files: File[] };

const ChmodFileModal = ({ files, ...props }: OwnProps) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { mutate } = useFileManagerSwr();
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const setSelectedFiles = ServerContext.useStoreActions((actions) => actions.files.setSelectedFiles);

    const submit = ({ mode }: FormikValues, { setSubmitting }: FormikHelpers<FormikValues>) => {
        clearFlashes('files');

        mutate(
            (data) =>
                data.map((f) =>
                    f.name === files[0].file ? { ...f, mode: fileBitsToString(mode, !f.isFile), modeBits: mode } : f
                ),
            false
        );

        const data = files.map((f) => ({ file: f.file, mode: mode }));

        chmodFiles(uuid, directory, data)
            .then((): Promise<any> => (files.length > 0 ? mutate() : Promise.resolve()))
            .then(() => setSelectedFiles([]))
            .catch((error) => {
                mutate();
                setSubmitting(false);
                clearAndAddHttpError({ key: 'files', error });
            })
            .then(() => props.onDismissed());
    };

    return (
        <Formik onSubmit={submit} initialValues={{ mode: files.length > 1 ? '' : files[0].mode || '' }}>
            {({ isSubmitting }) => (
                <Modal
                    {...props}
                    dismissable={!isSubmitting}
                    showSpinnerOverlay={isSubmitting}
                    className="rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl bg-[rgba(255,255,255,0.05)] shadow-2xl"
                >
                    <Form css={tw`m-0`}>
                        <div css={tw`flex flex-wrap items-end`}>
                            <div css={tw`w-full sm:flex-1 sm:mr-4`}>
                                <Field
                                    type={'string'}
                                    id={'file_mode'}
                                    name={'mode'}
                                    label={'File Mode'}
                                    autoFocus
                                    className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] backdrop-blur-md text-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                                />
                            </div>
                            <div css={tw`w-full sm:w-auto mt-4 sm:mt-0`}>
                                <Button
                                    css={tw`w-full`}
                                    className="rounded-lg border border-cyan-400/40 bg-[rgba(255,255,255,0.08)] backdrop-blur-md text-cyan-300 hover:border-cyan-300 hover:text-white transition-all duration-300"
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
};

export default ChmodFileModal;
