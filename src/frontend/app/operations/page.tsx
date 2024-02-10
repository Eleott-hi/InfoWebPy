"use client";
import { useState, useEffect } from 'react';
import Table from "@/components/Table";
import TableItemHandler from "@/components/TableItemHandler"
import { ExportCSV } from '@/components/ImportExport';
import { apiGetFunctions, apiGetFunctionInfo, apiExecuteFunction } from '@/components/ApiHandler';

export default function Operations() {
  const [table, setTable] = useState(null);
  const [isItemDialog, setIsItemDialog] = useState(false);
  const [functions, setFunctions] = useState([]);
  const [itemDialog, setItemDialog] = useState({});

  const getFunctions = () => apiGetFunctions((data) => setFunctions(data.functions));
  const ExecuteFunction = (f_name: string, params: any) => { setTable([]); apiExecuteFunction(f_name, params, setTable); }

  const OpenParametersDialog = (f_name: string, data: any) => {
    setItemDialog({
      header: "Enter parameters of " + f_name + ":",
      content: data,
      handleClose: (is_confirmed: boolean, params: any = null) => {
        if (is_confirmed) {
          console.log("CONFIRMED", params);
          ExecuteFunction(f_name, params);
        } else {
          console.log("CANCELED");
        }
        setIsItemDialog(false)
      }
    })
    setIsItemDialog(true);
  }

  const ParametersDialogLogic = (f_name: string, data: any) => {
    if (Object.keys(data).length === 0) {
      ExecuteFunction(f_name, {});
    } else {
      OpenParametersDialog(f_name, data);
    }
  }

  const FunctionHandler = (f_name: string) => { apiGetFunctionInfo(f_name, (data) => ParametersDialogLogic(f_name, data.input)); }

  useEffect(getFunctions, []);


  return (
    <div className="p-4 row">
      <div className="col-12 text-center">
        <h1>Operations</h1>
      </div>
      <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
        <ol>
          {
            functions.map((f_name) => (
              <li className='mt-1' key={f_name}>
                <button type="button" className='btn s21-btn' onClick={() => FunctionHandler(f_name)}>
                  {f_name}
                </button>
              </li>
            ))
          }
        </ol>
      </div>
      {
        table && (
          <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
            <div className="card s21-card">
              <Table data={table}></Table>
            </div>
            <button type="button" className="btn s21-btn mt-2 ms-auto" onClick={() => ExportCSV(table)}>
              Export
            </button>
          </div>
        )
      }
      {isItemDialog && (<TableItemHandler props={itemDialog} />)}
    </div>
  );
}
