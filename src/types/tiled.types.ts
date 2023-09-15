export type TilEdMap = {
    $: TilEdMapMetaData;
    tileset: TilEdTileset[];
    layer: TilEdLayer[];
}

export type TilEdMapMetaData = {
    version: string;
    tiledversion: string;
    orientation: string;
    renderorder: string;
    tileheight: string;
    tilewidth: string;
    height: string;
    width: string;
    infinite: string;
    nextobjectid: string;
    nextlayerid: string;
}

export type TilEdTileset = {
    $: TilEdTileSetMetaData,
    image: TilEdImage[]
}

export type TilEdTileSetMetaData = {
    firstgid: string;
    name: string;
    tilewidth: string;
    tileheight: string;
    tilecount: string;
    columns: string;
}

export type TilEdImage = {
    $: TilEdImageMetaData;
}

export type TilEdImageMetaData = {
    height: string;
    source: string;
    width: string;
}

export type TilEdLayer = {
    $: TilEdLayerMetaData;
    data: TilEdLayerData[];
}

export type TilEdLayerMetaData = {
    id: string;
    name: string;
    height: string;
    width: string;
}

export type TilEdLayerData = {
    _: string;
    $: TilEdLayerDataMetaData;
}

export type TilEdLayerDataMetaData = {
    encoding: TilEdLayerEncoding;
}

export type TilEdLayerEncoding = 'csv' | 'base64';