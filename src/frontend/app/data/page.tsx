"use client";
import React, { useState, useEffect } from 'react';

export default function Data() {

    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/tables", {
            method: "GET"
        })
            .then(response => response.json())
            .then(data => {
                console.log( data.tables);
                setTables(data.tables);
            })
            .catch(error => console.error('Error fetching tables:', error));
    }, []);



    const renderTableCard = (table: string) => (
        <div className="col" key={table}>
            <div className="card s21-card">
                <div className="card-body text-center">
                    <a href={"/data/" + table}>
                        <h5 className="card-title">{table}</h5>
                    </a>
                </div>
            </div>
        </div>
    );



    return (
        <div className="container p-4">
            <div className="container text-center">
                <h1>Tables</h1>
            </div>

            <div className="container mt-5">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {
                        tables.map(renderTableCard)
                    }
                </div>
            </div>
        </div>
    );
}
