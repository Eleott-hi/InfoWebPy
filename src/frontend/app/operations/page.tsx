"use client";
import { useState, useEffect } from 'react';
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

function WrapFunctions(functions: string[], dialogFnc: any) {

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

function ExecuteFunction(f_name: string, params: any, setTable: CallableFunction) {
  fetch("http://localhost:8000/functions/" + f_name + "/execute", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Table", data);
      setTable(data);
    })
    .catch(error => console.error('Error fetching tables:', error));
}

export default function Operations() {
  const [table, setTable] = useState(null);
  const [isItemDialog, setIsItemDialog] = useState(false);
  const [functions, setFunctions] = useState([]);
  const [chosenFunction, setChosenFunctions] = useState("");
  const [functionParams, setFunctionParams] = useState({});
  const [itemDialog, setItemDialog] = useState({
    header: "Enter function parameters:",
    content: { id: 1 },
    handleClose: (is_confirmed: boolean) => {
      if (is_confirmed) {
        console.log("CONFIRMED");
        ExecuteFunction(chosenFunction, itemDialog.content, setTable);
        // setTable(example_table)
      } else {
        console.log("CANCELED");
      }
      setIsItemDialog(false)
    }
  });

  const OpenParametersDialog = (func: string) => {
    console.log(func)
    console.log(chosenFunction)
    setChosenFunctions(func);
    console.log(chosenFunction)
    console.log(chosenFunction)

    fetch("http://localhost:8000/functions/" + func)
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data.input).length === 0) {
          ExecuteFunction(func, {}, setTable);
          return
        }
        setItemDialog({ ...itemDialog, content: data.input })
        setIsItemDialog(true);
      })
      .catch(error => console.error('Error fetching function info:', error));
  }

  useEffect(() => {
    fetch("http://localhost:8000/functions", {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.functions);
        setFunctions(data.functions);
      })
      .catch(error => console.error('Error fetching tables:', error));
  }, []);


  return (
    <div className="p-4 row">
      <div className="col-12 text-center">
        <h1>Operations</h1>
      </div>
      <div className="col-lg-6 col-sm-12 d-flex flex-column mt-3">
        {WrapFunctions(functions, OpenParametersDialog)}
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
