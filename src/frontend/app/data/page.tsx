import React from 'react';

export default function Data() {
    const tables = ['Table1', 'Table2', 'Table3', 'Table4', 'Table5'];

    const renderTableCard = (table: string) => (
        <div className="col-md-4">
            <div className="card mb-4">
                <a href={""}>
                    <div className="card-body">
                        <h5 className="card-title"><b>{table}</b></h5>
                    </div>
                </a>
            </div>
        </div>
    );



    return (
        <div className="center-content">
            <div className="container text-center mt-5">
                <h1>Tables</h1>
            </div>

            <div className="container mt-5">
                <div className="row">
                    {
                        tables.map(renderTableCard)
                    }
                </div>
            </div>
        </div>
    );
}
