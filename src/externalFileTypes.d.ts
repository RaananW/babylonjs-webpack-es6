// Images
declare module "*.jpg";
declare module "*.png";
declare module "*.env";

// 3D types
declare module "*.glb";
declare module "*.stl";

// Physics
declare module "ammo.js" {
    export type AmmoModule = Record<string, unknown>;

    interface AmmoFactory {
        new (): Promise<AmmoModule>;
    }

    const Ammo: AmmoFactory;
    export default Ammo;
}
