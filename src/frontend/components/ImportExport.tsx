import Papa from 'papaparse';

export function ExportCSV(table: any[]) {
    if (table.length === 0) {
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        Object.keys(table[0]).join(",") + "\n" +
        table.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
};



export function ImportCSV(e, on_done: (data: any) => void) {
    const file = e.target.files[0];
    Papa.parse(file, {
        complete: (result) => { console.log(result.data); on_done(result.data); },
        header: true
    });
};
