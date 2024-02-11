
import React from 'react';
import { useState } from 'react';

export default function Table({ data }: { data: any }) {
    const is_valid = Array.isArray(data) && data.length > 0;
    const columns = is_valid ? Object.keys(data[0]) : [];

    let i = 0

    const renderTableData = (item: any) => {
        console.log(i)
        return (
            <tr key={i++}>
                {
                    columns.map((column) => (
                        <td key={column} className='text-center'>
                            {item[column] !== null ? item[column] : "-"}
                        </td>
                    ))
                }
            </tr>
        );
    }

    return is_valid ?
        (
            <div className="">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {
                                columns.map((column) => (
                                    <th key={column} scope="col" className='text-center'>
                                        {column}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(renderTableData)
                        }
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="container-fluid d-flex align-items-center justify-content-center"
                style={{ minHeight: "200px" }}
            >
                <div className="text-center">
                    <h1>No data</h1>
                </div>
            </div>
        );
};

