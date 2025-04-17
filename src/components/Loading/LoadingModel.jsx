import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from './LoadingSpinner';

function LoadingModel({ noFade, showLoadingModal, setShowLoadingModal, handleCloseLoadingModal }) {
   
    return (
        <Transition appear show={showLoadingModal} as={Fragment}>
            <Dialog as="div" className="relative z-[99999]" onClose={handleCloseLoadingModal}>
                <Transition.Child
                    as={Fragment}
                    enter={noFade ? "" : "duration-300 ease-out"}
                    enterFrom={noFade ? "" : "opacity-0"}
                    enterTo={noFade ? "" : "opacity-100"}
                    leave={noFade ? "" : "duration-200 ease-in"}
                    leaveFrom={noFade ? "" : "opacity-100"}
                    leaveTo={noFade ? "" : "opacity-0"}
                >
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed  inset-0 overflow-y-auto flex justify-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter={noFade ? "" : "duration-300 ease-out"}
                        enterFrom={noFade ? "" : "opacity-0 scale-95"}
                        enterTo={noFade ? "" : "opacity-100 scale-100"}
                        leave={noFade ? "" : "duration-200 ease-in"}
                        leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                        leaveTo={noFade ? "" : "opacity-0 scale-95"}
                    >
                        <Dialog.Panel>
                            <div className='flex  justify-center items-center'>
                                <LoadingSpinner />
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default LoadingModel
