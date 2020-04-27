import * as Ammo from "ammo.js";

export const ammoModule = Ammo();
export const ammoReadyPromise = new Promise((resolve) => {
    ammoModule.then(() => {
        resolve();
    });
});
