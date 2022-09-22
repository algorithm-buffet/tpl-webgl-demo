import { updateDemoByPath } from "./utils";

export async function updateDemoFavorite({ request, params }) {
    let formData = await request.formData();
    return updateDemoByPath(request, {
        favorite: formData.get("favorite") === "true",
    });
}

