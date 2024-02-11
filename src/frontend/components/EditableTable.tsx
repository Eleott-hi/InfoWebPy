
import React from 'react';
import { useState } from 'react';

export default function EditableTable({ data,
    openDeleteItemConfirmDialog,
    openEditItemDialog,
}:
    {
        data: any[],
        openDeleteItemConfirmDialog: (id: string) => void,
        openEditItemDialog: (item: any) => void,
    }
) {
    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return data.length > 0 ?
        (
            <div className="">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column} scope="col" className='text-center'>
                                    {column}
                                </th>
                            ))}
                            <th scope="col" className='text-center'></th>
                            <th scope="col" className='text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item[Object.keys(item)[0]]}>
                                {columns.map((column) => (
                                    <td key={column} className='text-center'>{item[column]}</td>
                                ))}
                                <td className='text-center'>
                                    <button type='button'
                                        className='btn s21-btn'
                                        onClick={() => openEditItemDialog(item)}>Edit</button>
                                </td>
                                <td className='text-center'>
                                    <button type='button'
                                        className='btn s21-btn'
                                        onClick={() => openDeleteItemConfirmDialog(item[Object.keys(item)[0]])}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="container-fluid h-100 d-flex align-items-center justify-content-center ">
                <div className="text-center">
                    <h1>No data</h1>
                </div>
            </div>
        );
};

