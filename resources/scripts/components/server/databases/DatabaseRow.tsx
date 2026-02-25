import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/elements/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import { object, string } from 'yup';
import FlashMessageRender from '@/components/FlashMessageRender';
import { ServerContext } from '@/state/server';
import deleteServerDatabase from '@/api/server/databases/deleteServerDatabase';
import { httpErrorToHuman } from '@/api/http';
import RotatePasswordButton from '@/components/server/databases/RotatePasswordButton';
import Can from '@/components/elements/Can';
import { ServerDatabase } from '@/api/server/databases/getServerDatabases';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';
import GreyRowBox from '@/components/elements/GreyRowBox';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface Props {
    database: ServerDatabase;
    className?: string;
}

export default ({ database, className }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const { addError, clearFlashes } = useFlash();
    const [visible, setVisible] = useState(false);
    const [connectionVisible, setConnectionVisible] = useState(false);

    const appendDatabase = ServerContext.useStoreActions((actions) => actions.databases.appendDatabase);
    const removeDatabase = ServerContext.useStoreActions((actions) => actions.databases.removeDatabase);

    const jdbcConnectionString = `jdbc:mysql://${database.username}${
        database.password ? `:${encodeURIComponent(database.password)}` : ''
    }@${database.connectionString}/${database.name}`;

    const schema = object().shape({
        confirm: string()
            .required('The database name must be provided.')
            .oneOf([database.name.split('_', 2)[1], database.name], 'The database name must be provided.'),
    });

    const submit = (values: { confirm: string }, { setSubmitting }: FormikHelpers<{ confirm: string }>) => {
        clearFlashes();
        deleteServerDatabase(uuid, database.id)
            .then(() => {
                setVisible(false);
                setTimeout(() => removeDatabase(database.id), 150);
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                addError({ key: 'database:delete', message: httpErrorToHuman(error) });
            });
    };

    return (
    <>
        <Formik onSubmit={submit} initialValues={{ confirm: '' }} validationSchema={schema} isInitialValid={false}>
            {({ isSubmitting, isValid, resetForm }) => (
                <Modal
                    visible={visible}
                    dismissable={!isSubmitting}
                    showSpinnerOverlay={isSubmitting}
                    onDismissed={() => {
                        setVisible(false);
                        resetForm();
                    }}
                    className="rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl 
                               bg-[rgba(255,255,255,0.06)] shadow-2xl animate-fade-in p-6"
                >
                    <FlashMessageRender byKey={'database:delete'} className="mb-6" />
                    <h2 className="text-2xl mb-6 text-cyan-300 animate-slide-up">Confirm database deletion</h2>
                    <p className="text-sm text-neutral-300 animate-fade-in">
                        Deleting a database is a permanent action, it cannot be undone. This will permanently delete
                        the <strong className="text-white">{database.name}</strong> database and remove all associated data.
                    </p>
                    <Form className="m-0 mt-6 animate-slide-up">
                        <Field
                            type={'text'}
                            id={'confirm_name'}
                            name={'confirm'}
                            label={'Confirm Database Name'}
                            description={'Enter the database name to confirm deletion.'}
                        />
                        <div className="mt-6 text-right animate-fade-in">
                            <Button
                                type={'button'}
                                isSecondary
                                className="mr-2 rounded-lg border border-cyan-400/40 bg-[rgba(255,255,255,0.08)] 
                                           backdrop-blur-md text-cyan-300 hover:border-cyan-300 hover:text-white 
                                           transition-all duration-300"
                                onClick={() => setVisible(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type={'submit'}
                                color={'red'}
                                disabled={!isValid}
                                className="rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-all duration-300"
                            >
                                Delete Database
                            </Button>
                        </div>
                    </Form>
                </Modal>
            )}
        </Formik>

        <Modal
            visible={connectionVisible}
            onDismissed={() => setConnectionVisible(false)}
            className="rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-xl 
                       bg-[rgba(255,255,255,0.06)] shadow-2xl animate-fade-in p-6"
        >
            <FlashMessageRender byKey={'database-connection-modal'} className="mb-6" />
            <h3 className="mb-6 text-2xl text-cyan-300 animate-slide-up">Database connection details</h3>
            <div className="animate-fade-in">
                <Label>Endpoint</Label>
                <CopyOnClick text={database.connectionString}>
                    <Input type={'text'} readOnly value={database.connectionString} />
                </CopyOnClick>
            </div>
            <div className="mt-6 animate-slide-up">
                <Label>Connections from</Label>
                <Input type={'text'} readOnly value={database.allowConnectionsFrom} />
            </div>
            <div className="mt-6 animate-slide-up">
                <Label>Username</Label>
                <CopyOnClick text={database.username}>
                    <Input type={'text'} readOnly value={database.username} />
                </CopyOnClick>
            </div>
            <Can action={'database.view_password'}>
                <div className="mt-6 animate-slide-up">
                    <Label>Password</Label>
                    <CopyOnClick text={database.password} showInNotification={false}>
                        <Input type={'text'} readOnly value={database.password} />
                    </CopyOnClick>
                </div>
            </Can>
            <div className="mt-6 animate-slide-up">
                <Label>JDBC Connection String</Label>
                <CopyOnClick text={jdbcConnectionString} showInNotification={false}>
                    <Input type={'text'} readOnly value={jdbcConnectionString} />
                </CopyOnClick>
            </div>
            <div className="mt-6 text-right animate-fade-in">
                <Can action={'database.update'}>
                    <RotatePasswordButton databaseId={database.id} onUpdate={appendDatabase} />
                </Can>
                <Button
                    isSecondary
                    onClick={() => setConnectionVisible(false)}
                    className="rounded-lg border border-cyan-400/40 bg-[rgba(255,255,255,0.08)] 
                               backdrop-blur-md text-cyan-300 hover:border-cyan-300 hover:text-white 
                               transition-all duration-300"
                >
                    Close
                </Button>
            </div>
        </Modal>

        <GreyRowBox
            $hoverable={false}
            className={`${className} mb-2 rounded-xl border border-[rgba(255,255,255,0.08)] backdrop-blur-md 
                        bg-[rgba(255,255,255,0.05)] shadow-md transition-all duration-300 hover:shadow-lg hover:border-cyan-400/40 animate-fade-in`}
        >
            <div className="hidden md:block text-cyan-400">
                <FontAwesomeIcon icon={faDatabase} fixedWidth />
            </div>
            <div className="flex-1 ml-4">
                <CopyOnClick text={database.name}>
                    <p className="text-lg text-cyan-200 hover:text-white transition-colors duration-200">
                        {database.name}
                    </p>
                </CopyOnClick>
            </div>
            <div className="ml-8 text-center hidden md:block">
                <CopyOnClick text={database.connectionString}>
                    <p className="text-sm text-gray-400">{database.connectionString}</p>
                </CopyOnClick>
                <p className="mt-1 text-2xs text-neutral-500 uppercase select-none">Endpoint</p>
            </div>
            <div className="ml-8 text-center hidden md:block">
                <p className="text-sm text-gray-400">{database.allowConnectionsFrom}</p>
                <p className="mt-1 text-2xs text-neutral-500 uppercase select-none">Connections from</p>
            </div>
            <div className="ml-8 text-center hidden md:block">
                <CopyOnClick text={database.username}>
                    <p className="text-sm text-gray-400">{database.username}</p>
                </CopyOnClick>
                <p className="mt-1 text-2xs text-neutral-500 uppercase select-none">Username</p>
            </div>
            <div className="ml-8">
                <Button
                    isSecondary
                    className="mr-2 rounded-lg border border-cyan-400/40 bg-[rgba(255,255,255,0.08)] 
                               backdrop-blur-md text-cyan-300 hover:border-cyan-300 hover:text-white 
                               transition-all duration-300"
                    onClick={() => setConnectionVisible(true)}
                >
                    <FontAwesomeIcon icon={faEye} fixedWidth />
                </Button>
                <Can action={'database.delete'}>
                    <Button
                        color={'red'}
                        isSecondary
                        className="rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition-all duration-300"
                        onClick={() => setVisible(true)}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                    </Button>
                </Can>
            </div>
        </GreyRowBox>
    </>
);

};
