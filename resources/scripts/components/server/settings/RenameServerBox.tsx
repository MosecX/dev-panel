import React from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { Field as FormikField, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Actions, useStoreActions } from 'easy-peasy';
import renameServer from '@/api/server/renameServer';
import Field from '@/components/elements/Field';
import { object, string } from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';
import Label from '@/components/elements/Label';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import { Textarea } from '@/components/elements/Input';

interface Values {
    name: string;
    description: string;
}

const RenameServerBox = () => {
    const { isSubmitting } = useFormikContext<Values>();

    return (
        <TitledGreyBox
            title={'Change Server Details'}
            css={tw`
                relative rounded-xl border border-[rgba(255,255,255,0.08)]
                bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-lg p-6
            `}
        >
            <SpinnerOverlay visible={isSubmitting} />
            <Form css={tw`mb-0`}>
                {/* Server Name */}
                <Field
                    id={'name'}
                    name={'name'}
                    label={'Server Name'}
                    type={'text'}
                />

                {/* Server Description */}
                <div css={tw`mt-6`}>
                    <Label>Server Description</Label>
                    <FormikFieldWrapper name={'description'}>
                        <FormikField
                            as={Textarea}
                            name={'description'}
                            rows={3}
                            css={tw`
                                rounded-lg border border-neutral-700 
                                bg-[rgba(255,255,255,0.05)] backdrop-blur-md 
                                shadow-inner text-neutral-200
                            `}
                        />
                    </FormikFieldWrapper>
                </div>

                {/* Save button */}
                <div css={tw`mt-6 text-right`}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="
                            px-6 py-2 rounded-lg border border-blue-400/40 
                            bg-[rgba(59,130,246,0.15)] backdrop-blur-md 
                            text-blue-300 font-semibold shadow-md 
                            transition transform hover:scale-105 
                            hover:border-blue-400 hover:text-blue-200 
                            disabled:opacity-50
                        "
                    >
                        Save
                    </button>
                </div>
            </Form>
        </TitledGreyBox>
    );
};

export default () => {
    const server = ServerContext.useStoreState((state) => state.server.data!);
    const setServer = ServerContext.useStoreActions((actions) => actions.server.setServer);
    const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const submit = ({ name, description }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('settings');
        renameServer(server.uuid, name, description)
            .then(() => setServer({ ...server, name, description }))
            .catch((error) => {
                console.error(error);
                addError({ key: 'settings', message: httpErrorToHuman(error) });
            })
            .then(() => setSubmitting(false));
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                name: server.name,
                description: server.description,
            }}
            validationSchema={object().shape({
                name: string().required().min(1),
                description: string().nullable(),
            })}
        >
            <RenameServerBox />
        </Formik>
    );
};
