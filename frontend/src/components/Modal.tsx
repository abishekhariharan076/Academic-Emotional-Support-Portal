import React, { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-surface text-left shadow-2xl transition-all w-full max-w-2xl max-h-[90vh] flex flex-col">
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                    <Dialog.Title as="h3" className="text-xl font-bold text-text-main">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-text-muted hover:text-text-main hover:bg-canvas rounded-full transition-colors focus:outline-none"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 text-text-body space-y-6">
                                    {children}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-border flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
