import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector2, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { AssetsManager } from "@babylonjs/core/Misc/assetsManager";
import { SpriteMap } from "@babylonjs/core";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";

import { CreateSceneClass } from "../createScene";
import { TilEdLayerTiles, TilEdMap, TilEdTileset } from "../types/tiled.types";
import { AtlasJson, AtlasJsonFrame } from "../types/atlasjson.types";

import cityTilesetObject from "../../assets/galletcity_tiles.tsx2";
import cityMapObject from "../../assets/city.tmx";

export class TilEdSpriteMap implements CreateSceneClass {
    private assetsManager: AssetsManager | undefined;

    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);
        this.assetsManager = new AssetsManager(scene);

        void Promise.all([
            import("@babylonjs/core/Debug/debugLayer"),
            import("@babylonjs/inspector"),
        ]).then((_values) => {
            console.log(_values);
            scene.debugLayer.show({
                handleResize: true,
                overlay: true,
                globalRoot: document.getElementById("#root") || undefined,
            });
        });

        const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 8, Vector3.Zero());
        camera.attachControl(canvas, true);
        const light = new PointLight("Point", new Vector3(5, 10, 5), scene);
        light.intensity = 0.7;

        const atlasJson = this.TilEdTilesetToAtlasJson(cityTilesetObject.tileset);
        if (atlasJson) {
            this.DebugAtlasJson(cityTilesetObject.tileset, atlasJson, scene);
            //this.TilEdMapToSpriteMap(cityMapObject.map, cityTilesetObject.tileset, atlasJson, scene);
        }

        return scene;
    };

    private TilEdTilesetToAtlasJson(tileset: TilEdTileset): AtlasJson | undefined {
        if (!this.assetsManager) {
            return;
        }

        const imageHeight = parseInt(tileset.image[0].$.height)
        const rows = parseInt(tileset.image[0].$.height) / parseInt(tileset.$.tileheight);
        const columns = parseInt(tileset.image[0].$.width) / parseInt(tileset.$.tilewidth);
        const tileWidth = parseInt(tileset.$.tilewidth);
        const tileHeight = parseInt(tileset.$.tileheight);
        
        let tileCount = 1;
        const atlasJsonFrames: AtlasJsonFrame[] = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++ ) {
                const frame: AtlasJsonFrame = {
                    filename: tileCount + ".png",
                    frame: { x: 1 + j * tileWidth, y: 1 + imageHeight - (i + 1) * tileHeight, w: tileWidth, h: tileHeight  },
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: { x: 0, y: 0, w: tileWidth, h: tileHeight },
                    sourceSize: { w: tileWidth, h: tileHeight }
                }

                atlasJsonFrames.push(frame);
                tileCount++;
            }
        }

        const atlasJson: AtlasJson = {
            frames: atlasJsonFrames,
            meta: {
                app: "https://www.mapeditor.org/",
                version: tileset.$.version,
                image: tileset.image[0].$.source,
                format:"",
                size: {
                    w: parseInt(tileset.image[0].$.width),
                    h: parseInt(tileset.image[0].$.height)
                },
                scale: 1,
                smartupdate: ""
            }
        }

        return atlasJson;
    }

    private DebugAtlasJson(tileset: TilEdTileset, atlasJson: AtlasJson, scene: Scene) : void {
        const numberOfTiles = parseInt(tileset.$.tilecount);
        // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
        const spriteSheet = new Texture(tileset.image[0].$.source, scene);

        // Size of the map
        const backgroundSize = new Vector2(numberOfTiles, 1);

        // Create the sprite map
        const spriteMap = new SpriteMap(
            'TilEdMap',
            atlasJson,
            spriteSheet,
            {
                stageSize: backgroundSize,
                layerCount: 1,
            },
            scene
        );

        for (let i = 0; i < numberOfTiles; i++) {
            spriteMap.changeTiles(0, new Vector2(i, 0), i);
        }
    }

    private TilEdMapToSpriteMap(map: TilEdMap, tileset: TilEdTileset, atlasJson: AtlasJson, scene: Scene) : SpriteMap {
        // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
        const spriteSheet = new Texture(tileset.image[0].$.source, scene);

        // Size of the map
        const backgroundSize = new Vector2(parseInt(map.$.width), parseInt(map.$.height));

        // Create the sprite map
        const spriteMap = new SpriteMap(
            'TilEdMap',
            atlasJson,
            spriteSheet,
            {
                stageSize: backgroundSize,
                layerCount: map.layer.length,
                //flipU: true//, //Sometimes you need to flip, depending on the sprite format.
            },
            scene
        );

        // Update the SpriteMap with the data from the TilEd map
        for (let z = 0; z < map.layer.length; z++) {
            const layerData = this.CsvLayerToArray(map.layer[z].data[0]);
            for (let i = 0; i < backgroundSize.x; i++) {
                for (let j = 0; j < backgroundSize.y; j++) {
                    const tileNumber = layerData[i * backgroundSize.y + j];

                    // Tiled uses 0 for empty tiles, and regular tiles are 1-indexed
                    // AtlasJSON uses 0-index for frames
                    if (tileNumber > 0) {
                        spriteMap.changeTiles(z, new Vector2(i, j), tileNumber - 1);
                    }
                }
            }
        }

        return spriteMap;
    }

    private CsvLayerToArray(layer: TilEdLayerTiles): number[] {
        if (layer.$.encoding !== "csv") {
            throw new Error('Only CSV encoding is supported');
        }

        layer._ = layer._.replaceAll('\r\n', '');
        const split = layer._.split(',');
        const numbers = split.map((value: string) => { 
            return parseInt(value);
        });

        return numbers;
    }
}

export default new TilEdSpriteMap();
