"use client";
import { useState } from 'react';
import Table from "@/components/Table";
import { ExportCSV } from "@/components/ImportExport";
import { apiSendSqlRequest } from "@/components/ApiHandler"


export default function SQLRequest() {

    const [sqlRequest, setSqlRequest] = useState("");
    const [table, setTable] = useState(null);

    const sendSqlRequest = () => { apiSendSqlRequest(sqlRequest, (data) => setTable(data.response)) };
    const handleTextareaChange = (event) => { setSqlRequest(event.target.value); };

    return (
        <div className="p-4 row">
            <div className="col-12 text-center">
                <h1>SQL Request</h1>
            </div>
            <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
                <div className="form-floating">
                    <textarea
                        className="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea"
                        style={{ height: "200px" }}
                        onChange={handleTextareaChange}
                    ></textarea>
                    <label className="text-center" htmlFor="floatingTextarea">
                        Enter SQL Request:
                    </label>
                </div>
                <button type="button"
                    className="btn s21-btn mt-2 ms-auto"
                    onClick={sendSqlRequest}>
                    Execute
                </button>
            </div>
            {
                table && (
                    <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
                        <div className="card s21-card">
                            <Table data={table}></Table>
                        </div>
                        <button type="button"
                            className="btn s21-btn mt-2 ms-auto"
                            onClick={() => ExportCSV(table)}>
                            Export
                        </button>
                    </div>
                )
            }
        </div>
    );
}
