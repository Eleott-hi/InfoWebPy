import React from 'react';

export default function Data() {
    const tables = ['Table1', 'Table2', 'Table3', 'Table4', 'Table5'];

    const renderTableCard = (table: string) => (
        <div className="col">
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
        <div className="center-content">
            <div className="container text-center mt-5">
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
