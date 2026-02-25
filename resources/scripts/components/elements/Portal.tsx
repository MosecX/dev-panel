import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    children: React.ReactNode;
    targetId?: string; // opcional, por defecto "modal-portal"
}

const Portal: React.FC<Props> = ({ children, targetId = 'modal-portal' }) => {
    const [element, setElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const target = document.getElementById(targetId);
        if (target) {
            setElement(target);
        } else {
            console.warn(`⚠️ Portal target with id "${targetId}" not found in DOM.`);
        }
    }, [targetId]);

    if (!element) return null;

    return createPortal(children, element);
};

export default Portal;
