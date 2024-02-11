import ItemList from "./ItemList"
import { apiGetTableAsync } from "@/components/ApiHandler";

export default async function TablePage({ params }) {
    const response = await apiGetTableAsync(params.table_name);
    return (
        <ItemList t_name={params.table_name} items={response} />
    );
}
