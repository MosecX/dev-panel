import React, { useContext, useEffect, useRef } from 'react';
import { Subuser } from '@/state/server/subusers';
import { Form, Formik } from 'formik';
import { array, object, string } from 'yup';
import Field from '@/components/elements/Field';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import createOrUpdateSubuser from '@/api/server/users/createOrUpdateSubuser';
import { ServerContext } from '@/state/server';
import FlashMessageRender from '@/components/FlashMessageRender';
import Can from '@/components/elements/Can';
import { usePermissions } from '@/plugins/usePermissions';
import { useDeepCompareMemo } from '@/plugins/useDeepCompareMemo';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import PermissionTitleBox from '@/components/server/users/PermissionTitleBox';
import asModal from '@/hoc/asModal';
import PermissionRow from '@/components/server/users/PermissionRow';
import ModalContext from '@/context/ModalContext';

type Props = {
    subuser?: Subuser;
};

interface Values {
    email: string;
    permissions: string[];
}

const EditSubuserModal = ({ subuser }: Props) => {
    const ref = useRef<HTMLHeadingElement>(null);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const appendSubuser = ServerContext.useStoreActions((actions) => actions.subusers.appendSubuser);
    const { clearFlashes, clearAndAddHttpError } = useStoreActions(
        (actions: Actions<ApplicationStore>) => actions.flashes
    );
    const { dismiss, setPropOverrides } = useContext(ModalContext);

    const isRootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const permissions = useStoreState((state) => state.permissions.data);
    const loggedInPermissions = ServerContext.useStoreState((state) => state.server.permissions);
    const [canEditUser] = usePermissions(subuser ? ['user.update'] : ['user.create']);

    const editablePermissions = useDeepCompareMemo(() => {
        const cleaned = Object.keys(permissions).map((key) =>
            Object.keys(permissions[key].keys).map((pkey) => `${key}.${pkey}`)
        );

        const list: string[] = ([] as string[]).concat.apply([], Object.values(cleaned));

        if (isRootAdmin || (loggedInPermissions.length === 1 && loggedInPermissions[0] === '*')) {
            return list;
        }

        return list.filter((key) => loggedInPermissions.indexOf(key) >= 0);
    }, [isRootAdmin, permissions, loggedInPermissions]);

    const submit = (values: Values) => {
        setPropOverrides({ showSpinnerOverlay: true });
        clearFlashes('user:edit');

        createOrUpdateSubuser(uuid, values, subuser)
            .then((subuser) => {
                appendSubuser(subuser);
                dismiss();
            })
            .catch((error) => {
                console.error(error);
                setPropOverrides(null);
                clearAndAddHttpError({ key: 'user:edit', error });

                if (ref.current) {
                    ref.current.scrollIntoView();
                }
            });
    };

    useEffect(
        () => () => {
            clearFlashes('user:edit');
        },
        []
    );

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                email: subuser?.email || '',
                permissions: subuser?.permissions || [],
            }}
            validationSchema={object().shape({
                email: string()
                    .max(191, 'Email addresses must not exceed 191 characters.')
                    .email('A valid email address must be provided.')
                    .required('A valid email address must be provided.'),
                permissions: array().of(string()),
            })}
        >
            <Form
                css={tw`
                    rounded-xl border border-[rgba(255,255,255,0.08)]
                    bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-lg p-6
                `}
            >
                {/* Header */}
                <div css={tw`flex justify-between items-center`}>
                    <h2 css={tw`text-2xl font-semibold text-neutral-100`} ref={ref}>
                        {subuser
                            ? `${canEditUser ? 'Modify' : 'View'} permissions for ${subuser.email}`
                            : 'Create new subuser'}
                    </h2>
                    <Button
                        type={'submit'}
                        css={tw`
                            w-full sm:w-auto px-6 py-2 
                            rounded-lg border border-blue-400/40 
                            bg-[rgba(59,130,246,0.15)] backdrop-blur-md 
                            text-blue-300 font-semibold shadow-md 
                            transition transform hover:scale-105 
                            hover:border-blue-400 hover:text-blue-200 
                            disabled:opacity-50
                        `}
                    >
                        {subuser ? 'Save' : 'Invite User'}
                    </Button>
                </div>

                {/* Flash messages */}
                <FlashMessageRender byKey={'user:edit'} css={tw`mt-4`} />

                {/* Permissions notice */}
                {!isRootAdmin && loggedInPermissions[0] !== '*' && (
                    <div
                        css={tw`
                            mt-4 pl-4 py-2 border-l-4 border-cyan-400 
                            bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-lg shadow-inner
                        `}
                    >
                        <p css={tw`text-sm text-neutral-300`}>
                            Only permissions which your account is currently assigned may be selected when creating or
                            modifying other users.
                        </p>
                    </div>
                )}

                {/* Email field */}
                {!subuser && (
                    <div css={tw`mt-6`}>
                        <Field
                            name={'email'}
                            label={'User Email'}
                            description={
                                'Enter the email address of the user you wish to invite as a subuser for this server.'
                            }
                        />
                    </div>
                )}

                {/* Permissions list */}
                <div css={tw`my-6`}>
                    {Object.keys(permissions)
                        .filter((key) => key !== 'websocket')
                        .map((key, index) => (
                            <PermissionTitleBox
                                key={`permission_${key}`}
                                title={key}
                                isEditable={canEditUser}
                                permissions={Object.keys(permissions[key].keys).map((pkey) => `${key}.${pkey}`)}
                                css={index > 0 ? tw`mt-4` : undefined}
                            >
                                <p css={tw`text-sm text-neutral-400 mb-4`}>{permissions[key].description}</p>
                                {Object.keys(permissions[key].keys).map((pkey) => (
                                    <PermissionRow
                                        key={`permission_${key}.${pkey}`}
                                        permission={`${key}.${pkey}`}
                                        disabled={!canEditUser || editablePermissions.indexOf(`${key}.${pkey}`) < 0}
                                    />
                                ))}
                            </PermissionTitleBox>
                        ))}
                </div>

                {/* Footer */}
                <Can action={subuser ? 'user.update' : 'user.create'}>
                    <div css={tw`pb-6 flex justify-end`}>
                        <Button
                            type={'submit'}
                            css={tw`
                                w-full sm:w-auto px-6 py-2 
                                rounded-lg border border-blue-400/40 
                                bg-[rgba(59,130,246,0.15)] backdrop-blur-md 
                                text-blue-300 font-semibold shadow-md 
                                transition transform hover:scale-105 
                                hover:border-blue-400 hover:text-blue-200 
                                disabled:opacity-50
                            `}
                        >
                            {subuser ? 'Save' : 'Invite User'}
                        </Button>
                    </div>
                </Can>
            </Form>
        </Formik>
    );
};

export default asModal<Props>({
    top: false,
})(EditSubuserModal);
