import Ammo, { type AmmoModule } from "ammo.js";

let ammoModule: AmmoModule | undefined;

export const ammoReadyPromise = new Ammo().then((module) => {
    ammoModule = module;
    return module;
});

export const getAmmoModule = (): AmmoModule => {
    if (!ammoModule) {
        throw new Error("Ammo.js was accessed before it finished loading.");
    }
    return ammoModule;
};
