import React from 'react';

const base_table_api_url = "http://localhost:8000/tables";
const base_sql_request_api_url = "http://localhost:8000/sql-request"
const base_functions_api_url = "http://localhost:8000/functions";


export async function apiGetTables(on_done: (data: any) => void) {
    const data = await fetch(base_table_api_url,
        {
            method: "GET",
            cache: "no-cache",
        }
    )
    return data.json();
}

export async function apiGetTableAsync(t_name: string) {
    const response = await fetch(base_table_api_url + '/' + t_name,
        {
            method: "GET",
            cache: "no-cache",
        }
    )
    return response.json();
}

export function apiGetTable(t_name: string, on_done: (data: any) => void) {
    fetch(base_table_api_url + '/' + t_name, { method: "GET" })
        .then(response => response.json())
        .then(data => { console.log(data); on_done(data) })
        .catch(error => console.error('Error fetching tables:', error));
}


export function apiDeleteTable(t_name: string, on_done: CallableFunction) {
    fetch(base_table_api_url + '/' + t_name, { method: "DELETE" })
        .then((data) => { console.log(data); return data })
        .then((data) => { console.log(data); on_done(data) })
        .catch(error => console.error('Error deleting tables:', error));
}


export function apiEditItem(t_name: string, id: string, item: any, on_done: (data: any) => void) {
    fetch(base_table_api_url + '/' + t_name + "/" + id,
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        .then(data => { console.log(data); on_done(data); })
        .catch(error => console.error('Error editing item:', error));
}


export function apiCreateItem(t_name: string, item: any, on_done: (data: any) => void) {
    console.log("Creating item", item);
    fetch(base_table_api_url + '/' + t_name,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        .then(data => { console.log(data); on_done(data) })
        .catch(error => console.error('Error creating item:', error));
}

export function apiDeleteItem(t_name: string, id: string, on_done: (data: any) => void) {
    fetch(base_table_api_url + '/' + t_name + "/" + id, { method: "DELETE" })
        .then((data) => { console.log(data); on_done(data) })
        .catch(error => console.error('Error deleting item:', error));
}

export function apiImportTable(t_name: string, table: any[], on_done: (data: any) => void) {
    console.log(table);

    fetch(base_table_api_url + '/' + t_name + "/import",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(table)
        })
        .then(data => { console.log(data); on_done(data); })
        .catch(error => console.error('Error importing table:', error));

}


export async function apiGetFunctions() {
    const response = await fetch(base_functions_api_url, { method: "GET" })
    return response.json();
}


export function apiGetFunctionInfo(f_name: string, on_done: (data: any) => void) {
    fetch(base_functions_api_url + "/" + f_name)
        .then(response => response.json())
        .then(data => { console.log(data); on_done(data); })
        .catch(error => console.error('Error fetching function info:', error));
}

export function apiExecuteFunction(f_name: string, params: any, on_done: (data: any) => void) {
    fetch(base_functions_api_url + "/" + f_name + "/execute",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        })
        .then(response => response.json())
        .then(data => { console.log(data); on_done(data); })
        .catch(error => console.error('Error fetching tables:', error));
}

export function apiSendSqlRequest(sqlRequest: string, on_done: (data: any) => void) {
    fetch(base_sql_request_api_url + `?request=${sqlRequest}`, { method: "GET", })
        .then(response => response.json())
        .then(data => { console.log(data); on_done(data); })
}
