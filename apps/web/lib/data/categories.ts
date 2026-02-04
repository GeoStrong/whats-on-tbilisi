import { getCategories } from "../functions/supabaseFunctions";
import { Category } from "../types";

export const categories = (await getCategories()) as Category[];
