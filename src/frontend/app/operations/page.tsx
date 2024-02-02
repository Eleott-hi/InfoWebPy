"use client";
import { useState } from 'react';
import Table from "@/components/Table";
import TableItemHandler from "@/components/TableItemHandler"

const example_table = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 25 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 3, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 4, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 5, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 6, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 7, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 8, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 9, firstName: 'Jane', lastName: 'Smith', age: 30 },
  { id: 10, firstName: 'Jane', lastName: 'Smith', age: 30 },
]
const example_functions = [
  "fnc_1",
  "fnc_2",
  "fnc_3",
  "fnc_4",
  "fnc_5",
  "fnc_6",
  "fnc_7",
  "fnc_8",
  "fnc_9",
  "fnc_10",
];

function WrapFunctions(functions, dialogFnc) {
  let i = 1;
  return (
    <ol>
      {
        (
          functions.map((func) => (
            <li className='mt-1' key={func}>
              <button
                type="button"
                className='btn s21-btn'
                onClick={() => dialogFnc(func)}>
                {func}
              </button>
            </li>
          ))
        )
      }
    </ol>
  );
}

export default function Operations() {
  const [sqlRequest, setSqlRequest] = useState("");
  const [table, setTable] = useState(null);
  const [isItemDialog, setIsItemDialog] = useState(false);
  const [itemDialog, setItemDialog] = useState({
    header: "Enter function parameters:",
    content: { id: 1 },
    handleClose: (is_confirmed: boolean) => {
      if (is_confirmed) {
        console.log("CONFIRMED");
        setTable(example_table)
      } else {
        console.log("CANCELED");
      }
      setIsItemDialog(false)
    }
  });

  const OpenParametersDialog = (func: string) => {
    console.log(func)
    setIsItemDialog(true);
  }

  return (
    <div className="p-4 row">
      <div className="col-12 text-center">
        <h1>Operations</h1>
      </div>
      <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
        {WrapFunctions(example_functions, OpenParametersDialog)}
      </div>
      {
        table && (
          <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
            <div className="card s21-card">
              <Table data={table}></Table>
            </div>
            <button type="button"
              className="btn s21-btn mt-2 ms-auto">
              Export
            </button>
          </div>
        )
      }


      {isItemDialog && (<TableItemHandler props={itemDialog} />)}
    </div>
  );
}
