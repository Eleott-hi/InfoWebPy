import React, { useState } from 'react';

export default function TableItemHandler({
    props,
}: {
    props: {
        header: string;
        content: any;
        handleClose: (is_confirmed: boolean, item?: any) => void;
    };
}) {
    const [columnStates, setColumnStates] = useState(() => {
        const initialState: { [key: string]: any } = {};
        for (const column in props.content) {
            initialState[column] = props.content[column];
        }
        return initialState;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
        setColumnStates((prevState) => ({
            ...prevState,
            [column]: e.target.value,
        }));
    };

    const handleDarkAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            props.handleClose(false);
        }
    };

    const itemFromStates = (states: any) => {
        const item: { [key: string]: any } = {};
        for (const column in props.content) {
            item[column] = states[column];
        }
        return item;
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
                    alignItems: 'center',
                }}
            >
                <div className="card s21-card p-4 col-xl-3 col-md-6 col-10">
                    <h3 className="card-title text-center">{props.header}</h3>
                    <div className="card-body text-center">
                        {Object.keys(props.content).map((column) => (
                            <div className="col mt-3" key={column}>
                                <div className="row">
                                    <label htmlFor={column} className="col">
                                        {column}
                                    </label>
                                    <input
                                        id={column}
                                        className="col"
                                        value={columnStates[column]}
                                        onChange={(e) => handleInputChange(e, column)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col text-center">
                            <button type="button" className="btn s21-btn" onClick={() => props.handleClose(true, itemFromStates(columnStates))}>
                                Confirm
                            </button>
                        </div>
                        <div className="col text-center">
                            <button type="button" className="btn s21-subbtn" onClick={() => props.handleClose(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
