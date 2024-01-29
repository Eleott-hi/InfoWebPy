"use client";

import Image from "next/image";
import { useState } from 'react';
import Table from '../../../components/Table';

export default function TablePage({ params }) {
    const [data, setData] = useState([
        { id: 1, firstName: 'John', lastName: 'Doe', age: 25, some: "thing" },
        { id: 2, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 3, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 4, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 5, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 6, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 7, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 8, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 9, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
        { id: 10, firstName: 'Jane', lastName: 'Smith', age: 30, some: "thing" },
    ]);


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
                <div className="col-md-9 bg-light"
                    style={{ minWidth: 'fit-content' }}
                >
                    <Table data={data} />
                </div>

                <div className="col-md-3 ">
                    <div className="card s21-card align-items-center p-4"
                    // style={{ maxWidth: "300px" }}
                    >
                        <h4 className="text-center">Operations for the entire table</h4>
                        <button type="button" className="btn s21-btn mt-2">Drop table</button>
                        <button type="button" className="btn s21-btn mt-2">Create item</button>
                        <button type="button" className="btn s21-btn mt-2">Import table</button>
                        <button type="button" className="btn s21-btn mt-2">Export table</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
