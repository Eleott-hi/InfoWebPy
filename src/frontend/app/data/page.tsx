// import React, { useState, useEffect } from 'react';
import { apiGetTablesAsync } from "@/components/ApiHandler";

export default async function Data() {

    const response = await apiGetTablesAsync(() => { })

    return (
        <div className="container p-4">
            <div className="container text-center">
                <h1>Tables</h1>
            </div>

            <div className="container mt-5">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {
                        response.tables.map((table: string) => (
                            <div className="col" key={table}>
                                <div className="card s21-card">
                                    <div className="card-body text-center">
                                        <a href={"/data/" + table}>
                                            <h5 className="card-title">{table}</h5>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
