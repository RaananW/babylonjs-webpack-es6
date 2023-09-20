import { Scene, SpriteMap, Texture, Vector2 } from "@babylonjs/core";
import { TilEdLayerData, TilEdMap, TilEdTileset } from "../types/tiled.types";
import { AtlasJson, AtlasJsonFrame } from "../types/atlasjson.types";

export function debugTileset(map: TilEdMap, scene: Scene) : void {
    // Create the JSON atlas to map from the TilEd tileset to the BabylonJS SpriteMap
    const atlasJson = tilEdTilesetToAtlasJson(map.tileset[0], map.$.version);

    // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
    const spriteSheet = new Texture(map.tileset[0].image[0].$.source, scene,
        true,
        true,
        Texture.NEAREST_NEAREST_MIPNEAREST
    );
    spriteSheet.wrapU = Texture.CLAMP_ADDRESSMODE;
    spriteSheet.wrapV = Texture.CLAMP_ADDRESSMODE;

    // Size of the map
    const numberOfTiles = parseInt(map.tileset[0].$.tilecount);
    const backgroundSize = new Vector2(numberOfTiles, 1);

    // Create the sprite map
    const spriteMap = new SpriteMap(
        'TilEdMap',
        atlasJson,
        spriteSheet,
        {
            stageSize: backgroundSize,
            layerCount: 1
        },
        scene
    );

    // Render the tiles
    for (let i = 0; i < numberOfTiles; i++) {
        spriteMap.changeTiles(0, new Vector2(i, 0), i);
    }
}

export function tilEdMapToSpriteMap(map: TilEdMap, scene: Scene) : SpriteMap {
    // Create the JSON atlas to map from the TilEd tileset to the BabylonJS SpriteMap
    const atlasJson = tilEdTilesetToAtlasJson(map.tileset[0], map.$.version);

    // Load the spritesheet (with appropriate settings) associated with the JSON Atlas.
    const spriteSheet = new Texture(map.tileset[0].image[0].$.source, scene,
        true,
        true,
        Texture.NEAREST_NEAREST_MIPNEAREST
   );
   spriteSheet.wrapU = Texture.CLAMP_ADDRESSMODE;
   spriteSheet.wrapV = Texture.CLAMP_ADDRESSMODE;

   // Size of the map
   const width = parseInt(map.$.width);
   const height = parseInt(map.$.height);
   const backgroundSize = new Vector2(width, height);

   // Create the sprite map
   const spriteMap = new SpriteMap(
       'TilEdMap',
       atlasJson,
       spriteSheet,
       {
           stageSize: backgroundSize,
           layerCount: map.layer.length,
       },
       scene
   );

   // Last tile is transparent
   const lastTile = parseInt(map.tileset[0].$.tilecount) - 1;

   // Update the SpriteMap with the data from the TilEd map
   for (let z = 0; z < map.layer.length; z++) {
       const layerData = csvLayerToArray(map.layer[z].data[0]);
       for (let j = 0; j < height; j++) {
           for (let i = 0; i < width; i++) {
               const tileNumber = layerData[i + j * width];

               // TilEd uses 0 for empty tiles, which we will replace by a transparent tile as layers are opaque in SpriteMap
               // TilEd tiles are 1-indexed, while AtlasJSON uses 0-index for frames
               if (tileNumber > 0) {
                   spriteMap.changeTiles(z, new Vector2(i, height - j - 1), tileNumber - 1);
               } else {
                   spriteMap.changeTiles(z, new Vector2(i, height - j - 1), lastTile); // Transparent tile
               }
           }
       }
   }

   return spriteMap;
}

function tilEdTilesetToAtlasJson(tileset: TilEdTileset, version: string): AtlasJson {
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
                frame: { x: j * tileWidth, y: imageHeight - (i + 1) * tileHeight, w: tileWidth, h: tileHeight  },
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
            version: version,
            image: tileset.image[0].$.source,
            format:"RGBA8888",
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

function csvLayerToArray(layer: TilEdLayerData): number[] {
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