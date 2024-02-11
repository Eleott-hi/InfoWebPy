const ssr_host = "http://fastapi:8000";
const csr_host = "http://localhost:8000";

const base_table_api_url = "/tables";
const base_sql_request_api_url = "/sql-request"
const base_functions_api_url = "/functions";

export async function apiGetTablesAsync(on_done: (data: any) => void) {
    const data = await fetch(ssr_host + base_table_api_url,
        {
            method: "GET",
            cache: "no-cache",
        }
    )
    return data.json();
}

export async function apiGetTableAsync(t_name: string) {
    const response = await fetch(ssr_host + base_table_api_url + '/' + t_name,
        {
            method: "GET",
            cache: "no-cache",
        }
    )
    return response.json();
}

export async function apiGetTableColumnsAsync(t_name: string) {
    const response = await fetch(ssr_host + base_table_api_url + '/' + t_name + "/columns",
        {
            method: "GET",
            cache: "no-cache",
        }
    )
    return response.json();
}


export async function apiGetFunctionsAsync() {
    const response = await fetch(ssr_host + base_functions_api_url,
        {
            method: "GET",
            cache: "no-cache",
        }
    )
    return response.json();
}



export function apiGetTable(t_name: string, on_done: (data: any) => void) {
    fetch(csr_host + base_table_api_url + '/' + t_name, { method: "GET" })
        .then(response => response.json())
        .then(data => { console.log(data); on_done(data) })
        .catch(error => console.error('Error fetching tables:', error));
}


export function apiDeleteTable(t_name: string, on_done: CallableFunction) {
    fetch(csr_host + base_table_api_url + '/' + t_name, { method: "DELETE" })
        .then((data) => { console.log(data); return data })
        .then((data) => { console.log(data); on_done(data) })
        .catch(error => console.error('Error deleting tables:', error));
}


export function apiEditItem(t_name: string, id: string, item: any, on_done: (data: any) => void, on_error: (data: any) => void) {
    fetch(csr_host + base_table_api_url + '/' + t_name + "/" + id,
        {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        .then(response => { if (response.status !== 200) throw Error("Could not edit item"); return response.json() })
        .then(data => { console.log(data); on_done(data); })
        .catch(error => { console.error('Error editing item:', error); on_error(error) });
}


export function apiCreateItem(t_name: string, item: any, on_done: (data: any) => void, on_error: (data: any) => void) {
    console.log("Creating item", item);
    fetch(csr_host + base_table_api_url + '/' + t_name,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        .then(response => { if (response.status !== 200) throw Error("Could not create item"); return response.json() })
        .then(data => { console.log(data); on_done(data) })
        .catch(error => { console.error('Error creating item:', error); on_error(error) });
}

export function apiDeleteItem(t_name: string, id: string, on_done: (data: any) => void) {
    fetch(csr_host + base_table_api_url + '/' + t_name + "/" + id, { method: "DELETE" })
        .then((data) => { console.log(data); on_done(data) })
        .catch(error => console.error('Error deleting item:', error));
}

export function apiImportTable(t_name: string, table: any[], on_done: (data: any) => void) {
    fetch(csr_host + base_table_api_url + '/' + t_name + "/import",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(table)
        })
        .then(data => { console.log(data); on_done(data); })
        .catch(error => console.error('Error importing table:', error));
}


export function apiGetFunctionInfo(f_name: string, on_done: (data: any) => void) {
    fetch(csr_host + base_functions_api_url + "/" + f_name)
        .then(response => response.json())
        .then(data => { console.log(data); on_done(data); })
        .catch(error => console.error('Error fetching function info:', error));
}

export function apiExecuteFunction(f_name: string, params: any, on_done: (data: any) => void, on_error: (data: any) => void) {
    fetch(csr_host + base_functions_api_url + "/" + f_name + "/execute",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        })
        .then(response => { if (response.status !== 200) throw Error("Could not execute function"); return response.json() })
        .then(data => { console.log(data); on_done(data); })
        .catch(error => { console.error('Error fetching tables:', error); on_error(error) });
}

export function apiSendSqlRequest(sqlRequest: string, on_done: (data: any) => void, on_error: (data: any) => void) {
    fetch(csr_host + base_sql_request_api_url + `?request=${sqlRequest}`, { method: "GET", })
        .then(response => { console.log(response); return response })
        .then(response => { if (response.status !== 200) throw Error("Could not execute function"); return response.json() })
        .then(on_done)
        .catch(error => { console.error('Error fetching sql request:', error); on_error(error) });
}
