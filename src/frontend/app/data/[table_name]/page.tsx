import ItemList from "./ItemList"
import { apiGetTableAsync, apiGetTableColumnsAsync } from "@/components/ApiHandler";

export default async function TablePage({ params }: { params: { table_name: string } }) {
    const table = await apiGetTableAsync(params.table_name);
    const columns = await apiGetTableColumnsAsync(params.table_name);
    return (
        <ItemList t_name={params.table_name} columns={columns} items={table} />
    );
}
