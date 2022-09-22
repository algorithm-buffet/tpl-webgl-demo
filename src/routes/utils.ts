import { demos } from "../demos/index";

// 支持搜索词过滤
export const getDemos = (q: string | null) => {
    if (!q) {
        return demos;
    }
    return demos.map(demo => {
        const { comps, ...others } = demo;
        return {
            ...others,
            comps: comps.filter(comp => {
                return comp.path.indexOf(q) !== -1 || comp.title.indexOf(q) !== -1
            })
        }
    });
}

export const getDemoByPath = (pathArr: string[]) => {
    const category = pathArr[0];
    const path = pathArr[1];
    const targetItem = demos.find(ele => ele.category === category);
    return targetItem?.comps.find(comp => comp.path === path)
}

export const getPathArr = (request: Request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const pathArr = pathname.split('/');
    pathArr.shift(); // 去掉第一个 ''
    return pathArr;
}

export const updateDemoByPath = (request: Request, configs: any) => {
    const pathArr = getPathArr(request);
    const demo = getDemoByPath(pathArr) as any;

    if (demo) {
        for (const keyName in configs) {
            if (Object.prototype.hasOwnProperty.call(configs, keyName)) {
                const ele = configs[keyName];
                demo[keyName] = ele;
            }
        }
    }
}