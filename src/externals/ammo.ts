import * as Ammo from "ammo.js";

export let ammoModule: any;
export const ammoReadyPromise = new Promise((resolve) => {
    Ammo().then((res: unknown) => {
        ammoModule = res;
        resolve(res);
    });
});
