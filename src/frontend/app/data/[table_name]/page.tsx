"use client";
import React, { useState, useEffect } from 'react';

import EditableTable from '@/components/EditableTable';
import ConfirmDialog from '@/components/ConfirmDialog';
import TableItemHandler from '@/components/TableItemHandler';


export default function TablePage({ params }) {
    const [table, setTable] = useState([
        // { id: 1, firstName: 'John', lastName: 'Doe', age: 25, some: "thing" },
        // { id: 2, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 3, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 4, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 5, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 6, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 7, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 8, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 9, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        // { id: 10, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
    ]);



    const updateTable = () => {
        console.log("http://localhost:8000/tables/" + params.table_name)
        fetch("http://localhost:8000/tables/" + params.table_name, {
            method: "GET"
        })
            .then(response => response.json())
            .then(data => {
                console.log("here", data);
                setTable(data);
            })
            .catch(error => console.error('Error fetching tables:', error));
    }

    const editItem = (id: string, item: any) => {
        console.log("Confirm editting item with id: " + id, item);
        fetch("http://localhost:8000/tables/" + params.table_name + "/" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(_ => {
                console.log("Confirm editting item with id: " + id, item);
                updateTable();
            })
            .catch(error => console.error('Error fetching tables:', error));
    }

    const deleteItem = (id: string) => {
        console.log("Confirm deletion of item with id:", id);
        fetch("http://localhost:8000/tables/" + params.table_name + "/" + id, {
            method: "DELETE",
        })
            .then((data) => {
                console.log(data);
                updateTable();
            })
            .catch(error => console.error('Error fetching tables:', error));
    }

    const createItem = (item: any) => {
        console.log("Creating item", item);
        fetch("http://localhost:8000/tables/" + params.table_name, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(_ => {
                console.log("Item created:", item);
                updateTable();
            })
            .catch(error => console.error('Error fetching tables:', error));
    }


    const deleteTable = () => {
        console.log("Confirmed table deletion");
        fetch("http://localhost:8000/tables/" + params.table_name,
            {
                method: "DELETE",
            }
        )
            .then((data) => {
                console.log(data);
                updateTable();
            })
            .catch(error => console.error('Error fetching tables:', error));
    }

    useEffect(() => updateTable, []);

    const [isConfirmDialog, setIsConfirmDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({});
    const [isItemDialog, setIsItemDialog] = useState(false);
    const [itemDialog, setItemDialog] = useState({});

    const openDeleteItemConfirmDialog = (id: string) => {
        setConfirmDialog({
            header: "Confirm Deletion of item with id: " + id + "?",
            content: "Are you sure you want to delete this item? This action cannot be undone.",
            handleClose: (isConfirmed: boolean) => {
                if (isConfirmed) {
                    deleteItem(id);
                } else {
                    console.log("Cencel deletion of item: " + id);
                }
                setIsConfirmDialog(false);
            },
        });
        setIsConfirmDialog(true);
    };

    const openDeleteTableConfirmDialog = () => {
        setConfirmDialog({
            header: "Confirm Deletion of table: " + params.table_name + "?",
            content: "Are you sure you want to delete this table? All contents of this table and related with this table will be lost.",
            handleClose: (isConfirmed: boolean) => {
                if (isConfirmed) {
                    deleteTable();
                } else {
                    console.log("Cencel deletion of table: " + params.table_name);
                }
                setIsConfirmDialog(false);
            },
        });
        setIsConfirmDialog(true);
    };

    const openItemConfirmDialog = (dialogState: any) => {
        setConfirmDialog({ ...dialogState });
        setIsConfirmDialog(true);
    };

    const openEditItemDialog = (item: any) => {
        const id = item[Object.keys(item)[0]]

        setItemDialog({
            header: "Edit item with id: " + id,
            content: item,
            handleClose: (isConfirmed: boolean, item: any = null) => {
                if (isConfirmed) {
                    const confirmDialogState = {
                        header: "Edit item with id: " + id + " ?",
                        content: "Are you sure you want to edit this item?",
                        handleClose: (is_confirmed: boolean) => {
                            if (is_confirmed) {
                                editItem(id, item);
                                setIsConfirmDialog(false);
                                setIsItemDialog(false);
                            } else {
                                setIsConfirmDialog(false);
                            }
                        },
                    }
                    openItemConfirmDialog(confirmDialogState);

                } else {
                    console.log("Cencel editting item with id: " + id, item);
                    setIsItemDialog(false);
                }
            },
        });

        setIsItemDialog(true);
    };

    const openCreateItemDialog = () => {
        const item = table[0]

        setItemDialog({
            header: "Create item",
            content: item,
            handleClose: (isConfirmed: boolean, item: any = null) => {
                if (isConfirmed) {
                    const confirmDialogState = {
                        header: "Create item?",
                        content: "Are you sure you want to create new item?",
                        handleClose: (is_confirmed: boolean) => {
                            if (is_confirmed) {
                                createItem(item);
                                setIsConfirmDialog(false);
                                setIsItemDialog(false);
                            } else {
                                setIsConfirmDialog(false);
                            }
                        },
                    }

                    openItemConfirmDialog(confirmDialogState);

                } else {
                    console.log("Cencel creating new item", item);
                    setIsItemDialog(false);
                }
            },
        });

        setIsItemDialog(true);
    };

    return (
        <div className="p-4">
            <div className="d-flex align-items-center justify-content-center p-4">
                <a href="/data/" className="text-decoration-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                </a>
                <h1 className="ms-3">Table: {params.table_name}</h1>
            </div>

            <div className="row">
                <div className="col-md-9 card s21-card mb-5"
                    style={{ minWidth: 'fit-content' }}
                >
                    <EditableTable data={table}
                        openDeleteItemConfirmDialog={openDeleteItemConfirmDialog}
                        openEditItemDialog={openEditItemDialog}
                    />
                </div>

                <div className="col-md-3">
                    <div className="card s21-card align-items-center p-4"
                    // style={{ maxWidth: "300px" }}
                    >
                        <h4 className="text-center">Operations for the entire table</h4>
                        <button type="button"
                            className="btn s21-btn mt-2"
                            onClick={openDeleteTableConfirmDialog}>
                            Drop table
                        </button>
                        <button type="button"
                            className="btn s21-btn mt-2"
                            onClick={openCreateItemDialog}>
                            Create item
                        </button>
                        <button type="button" className="btn s21-btn mt-2">Import table</button>
                        <button type="button" className="btn s21-btn mt-2">Export table</button>
                    </div>
                </div>
            </div>

            {isItemDialog && (<TableItemHandler props={itemDialog} />)}
            {isConfirmDialog && (<ConfirmDialog props={confirmDialog} />)}
        </div>
    );
}
