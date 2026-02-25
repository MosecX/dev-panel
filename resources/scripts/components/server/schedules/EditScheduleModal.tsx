import React, { useContext, useEffect, useState } from 'react';
import { Schedule } from '@/api/server/schedules/getServerSchedules';
import Field from '@/components/elements/Field';
import { Form, Formik, FormikHelpers } from 'formik';
import FormikSwitch from '@/components/elements/FormikSwitch';
import createOrUpdateSchedule from '@/api/server/schedules/createOrUpdateSchedule';
import { ServerContext } from '@/state/server';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import ModalContext from '@/context/ModalContext';
import asModal from '@/hoc/asModal';
import Switch from '@/components/elements/Switch';
import ScheduleCheatsheetCards from '@/components/server/schedules/ScheduleCheatsheetCards';

interface Props {
    schedule?: Schedule;
}

interface Values {
    name: string;
    dayOfWeek: string;
    month: string;
    dayOfMonth: string;
    hour: string;
    minute: string;
    enabled: boolean;
    onlyWhenOnline: boolean;
}

const EditScheduleModal = ({ schedule }: Props) => {
    const { addError, clearFlashes } = useFlash();
    const { dismiss } = useContext(ModalContext);

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const appendSchedule = ServerContext.useStoreActions((actions) => actions.schedules.appendSchedule);
    const [showCheatsheet, setShowCheetsheet] = useState(false);

    useEffect(() => {
        return () => {
            clearFlashes('schedule:edit');
        };
    }, []);

    const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes('schedule:edit');
        createOrUpdateSchedule(uuid, {
            id: schedule?.id,
            name: values.name,
            cron: {
                minute: values.minute,
                hour: values.hour,
                dayOfWeek: values.dayOfWeek,
                month: values.month,
                dayOfMonth: values.dayOfMonth,
            },
            onlyWhenOnline: values.onlyWhenOnline,
            isActive: values.enabled,
        })
            .then((schedule) => {
                setSubmitting(false);
                appendSchedule(schedule);
                dismiss();
            })
            .catch((error) => {
                console.error(error);
                setSubmitting(false);
                addError({ key: 'schedule:edit', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={
                {
                    name: schedule?.name || '',
                    minute: schedule?.cron.minute || '*/5',
                    hour: schedule?.cron.hour || '*',
                    dayOfMonth: schedule?.cron.dayOfMonth || '*',
                    month: schedule?.cron.month || '*',
                    dayOfWeek: schedule?.cron.dayOfWeek || '*',
                    enabled: schedule?.isActive ?? true,
                    onlyWhenOnline: schedule?.onlyWhenOnline ?? true,
                } as Values
            }
        >
            {({ isSubmitting }) => (
                <Form>
                    <h3 css={tw`text-2xl mb-6 font-semibold`}>
                        {schedule ? 'Edit schedule' : 'Create new schedule'}
                    </h3>
                    <FlashMessageRender byKey={'schedule:edit'} css={tw`mb-6`} />

                    <Field
                        name={'name'}
                        label={'Schedule name'}
                        description={'A human readable identifier for this schedule.'}
                    />

                    <div css={tw`grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6`}>
                        <Field name={'minute'} label={'Minute'} />
                        <Field name={'hour'} label={'Hour'} />
                        <Field name={'dayOfMonth'} label={'Day of month'} />
                        <Field name={'month'} label={'Month'} />
                        <Field name={'dayOfWeek'} label={'Day of week'} />
                    </div>

                    <p css={tw`text-neutral-400 text-xs mt-2`}>
                        The schedule system supports the use of Cronjob syntax when defining when tasks should begin
                        running. Use the fields above to specify when these tasks should begin running.
                    </p>

                    {/* Cheatsheet toggle */}
                    <div css={tw`mt-6 rounded-lg border border-neutral-700 bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-md p-4`}>
                        <Switch
                            name={'show_cheatsheet'}
                            description={'Show the cron cheatsheet for some examples.'}
                            label={'Show Cheatsheet'}
                            defaultChecked={showCheatsheet}
                            onChange={() => setShowCheetsheet((s) => !s)}
                        />
                        {showCheatsheet && (
                            <div css={tw`block md:flex w-full mt-4`}>
                                <ScheduleCheatsheetCards />
                            </div>
                        )}
                    </div>

                    {/* Only when online */}
                    <div css={tw`mt-6 rounded-lg border border-neutral-700 bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-md p-4`}>
                        <FormikSwitch
                            name={'onlyWhenOnline'}
                            description={'Only execute this schedule when the server is in a running state.'}
                            label={'Only When Server Is Online'}
                        />
                    </div>

                    {/* Enabled */}
                    <div css={tw`mt-6 rounded-lg border border-neutral-700 bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-md p-4`}>
                        <FormikSwitch
                            name={'enabled'}
                            description={'This schedule will be executed automatically if enabled.'}
                            label={'Schedule Enabled'}
                        />
                    </div>

                    {/* Submit button */}
                    <div css={tw`mt-6 text-right`}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="
                                w-full sm:w-auto px-6 py-2 
                                rounded-lg border border-blue-400/40 
                                bg-[rgba(59,130,246,0.15)] backdrop-blur-md 
                                text-blue-300 font-semibold shadow-md 
                                transition transform hover:scale-105 
                                hover:border-blue-400 hover:text-blue-200 
                                disabled:opacity-50
                            "
                        >
                            {schedule ? 'Save changes' : 'Create schedule'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default asModal<Props>()(EditScheduleModal);
