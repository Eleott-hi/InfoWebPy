"use client";
import React, { useState, useRef, useEffect } from 'react';

import EditableTable from '@/components/EditableTable';
import ConfirmDialog from '@/components/ConfirmDialog';
import TableItemHandler from '@/components/TableItemHandler';
import { apiGetTable, apiDeleteTable, apiEditItem, apiCreateItem, apiDeleteItem, apiImportTable } from '@/components/ApiHandler';
import { ExportCSV, ImportCSV } from '@/components/ImportExport';
import ErrorDialog from '@/components/ErrorDialog';

export default function ItemList({ t_name, columns, items }: { t_name: string, columns: any[string], items: any[] }) {
    const [table, setTable] = useState(items);
    const [isConfirmDialog, setIsConfirmDialog] = useState(false);
    const [isItemDialog, setIsItemDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        header: "",
        content: "",
        handleClose: (is_confirmed: boolean) => { },
    });
    const [itemDialog, setItemDialog] = useState({
        header: "",
        content: {},
        handleClose: (is_confirmed: boolean) => { },
    });
    const [isErrorDialog, setIsErrorDialog] = useState(false);
    const [errorProps, setErrorProps] = useState({
        header: "Invalid item parameters",
        content: "Please check your input and try again",
        handleClose: () => { setIsErrorDialog(false) }
    });


    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateTable = () => apiGetTable(t_name, setTable);
    const deleteTable = () => apiDeleteTable(t_name, updateTable);
    const editItem = (id: string, item: any) => apiEditItem(t_name, id, item, updateTable, () => setIsErrorDialog(true));
    const createItem = (item: any) => apiCreateItem(t_name, item, updateTable, () => setIsErrorDialog(true));
    const deleteItem = (id: string) => apiDeleteItem(t_name, id, updateTable);
    const uploadTable = (data: any[]) => apiImportTable(t_name, data, updateTable);

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
            header: "Confirm Deletion of table: " + t_name + "?",
            content: "Are you sure you want to delete this table? All contents of this table and related with this table will be lost.",
            handleClose: (isConfirmed: boolean) => {
                if (isConfirmed) {
                    deleteTable();
                } else {
                    console.log("Cencel deletion of table: " + t_name);
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
        const item: any = {};

        columns.forEach((column: any) => {
            item[column] = "";
        });

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
                <h1 className="ms-3">Table: {t_name}</h1>
            </div>
            <div className="row">
                <div className="col-md-9 card s21-card mb-5"
                    style={{ minWidth: 'fit-content' }}>
                    <EditableTable
                        data={table}
                        openDeleteItemConfirmDialog={openDeleteItemConfirmDialog}
                        openEditItemDialog={openEditItemDialog} />
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
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={e => ImportCSV(e, (data) => uploadTable(data))}
                        />
                        <button type="button"
                            className="btn s21-btn mt-2"
                            onClick={() => fileInputRef?.current?.click()}>
                            Import table
                        </button>
                        <button type="button"
                            className="btn s21-btn mt-2"
                            onClick={() => ExportCSV(table)}>
                            Export table
                        </button>
                    </div>
                </div>
            </div>
            {isItemDialog && (<TableItemHandler props={itemDialog} />)}
            {isConfirmDialog && (<ConfirmDialog props={confirmDialog} />)}
            {isErrorDialog && (<ErrorDialog props={errorProps} />)}
        </div>
    );
}
