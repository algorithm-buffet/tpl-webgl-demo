import { demos } from "../demos/index";
import { getPathArr, getDemos, getDemoByPath } from "./utils";

export async function rootLoader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const demos = await getDemos(q);

    const pathArr = getPathArr(request);
    const currentDemo = getDemoByPath(pathArr);
    return { demos, q, currentDemo };
}

export async function contentLoader({ request }) {
    const pathArr = getPathArr(request);
    const demo = getDemoByPath(pathArr);
    return { demo, pathArr };
}