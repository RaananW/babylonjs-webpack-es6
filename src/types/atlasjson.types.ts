import { Rectangle, Size } from "./common.types";

export type AtlasJson = {
    frames: AtlasJsonFrame[];
    meta: AtlasJsonMeta;
}

export type AtlasJsonMeta = {
    app: string;
    version: string;
    image: string;
    format: string;
    size: Size;
    scale: number;
    smartupdate: string;
}

export type AtlasJsonFrame = {
    filename: string;
    frame: Rectangle;
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: Rectangle;
    sourceSize: Size;
}