import React, { ElementType, forwardRef, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import styles from './style.module.css';
import classNames from 'classnames';
import DropdownItem from '@/components/elements/dropdown/DropdownItem';
import DropdownButton from '@/components/elements/dropdown/DropdownButton';

interface Props {
    as?: ElementType;
    children: React.ReactNode;
}

const DropdownGap = ({ invisible }: { invisible?: boolean }) => (
    <div
        className={classNames('border m-2', {
            'border-[rgba(255,255,255,0.08)]': !invisible,
            'border-transparent': invisible,
        })}
    />
);

type TypedChild = (React.ReactChild | React.ReactFragment | React.ReactPortal) & {
    type?: JSX.Element;
};

const Dropdown = forwardRef<typeof Menu, Props>(({ as, children }, ref) => {
    const [Button, items] = useMemo(() => {
        const list = React.Children.toArray(children) as unknown as TypedChild[];

        return [
            list.filter((child) => child.type === DropdownButton),
            list.filter((child) => child.type !== DropdownButton),
        ];
    }, [children]);

    if (!Button) {
        throw new Error('Cannot mount <Dropdown /> component without a child <Dropdown.Button />.');
    }

    return (
        <Menu as={as || 'div'} className={styles.menu} ref={ref}>
            {Button}
            <Transition
                enter={'transition duration-150 ease-out'}
                enterFrom={'transform scale-95 opacity-0'}
                enterTo={'transform scale-100 opacity-100'}
                leave={'transition duration-100 ease-in'}
                leaveFrom={'transform scale-100 opacity-100'}
                leaveTo={'transform scale-95 opacity-0'}
            >
                <Menu.Items
                    className={classNames(
                        styles.items_container,
                        'w-56 mt-2 rounded-xl shadow-xl',
                        'bg-[rgba(0,0,0,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] text-gray-200'
                    )}
                >
                    <div className={'px-2 py-2'}>{items}</div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
});

const _Dropdown = Object.assign(Dropdown, {
    Button: DropdownButton,
    Item: DropdownItem,
    Gap: DropdownGap,
});

export { _Dropdown as default };
