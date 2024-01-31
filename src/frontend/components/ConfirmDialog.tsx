import React, { useState } from 'react';

export default function ConfirmDialog({
    props
}: {
    props: {
        header: string;
        content: string;
        handleClose: (result: boolean) => void;
    };
}) {
    const handleDarkAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            props.handleClose(false);
        }
    };

    return (
        <div>
            <div
                onClick={handleDarkAreaClick}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <div className='card s21-card p-4 col-xl-3 col-md-6 col-10'>
                    <h3 className='card-title text-center'>{props.header}</h3>
                    <div className='card-body text-center'>
                        <h5>{props.content}</h5>
                    </div>
                    <div className='row'>
                        <div className='col text-center'>
                            <button
                                type='button'
                                className='btn s21-btn'
                                onClick={() => props.handleClose(true)}
                            >
                                Confirm
                            </button>
                        </div>
                        <div className='col text-center'>
                            <button
                                type='button'
                                className='btn s21-subbtn'
                                onClick={() => props.handleClose(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
