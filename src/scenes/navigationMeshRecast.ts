import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";

import { RecastJSPlugin } from "@babylonjs/core/Navigation/Plugins/recastJSPlugin";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

import Recast from "recast-detour";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { LinesMesh } from "@babylonjs/core/Meshes/linesMesh";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

import "@babylonjs/core/Culling/ray";

// import * as GUI from "@babylonjs/gui";

const agents: { idx: number, trf: TransformNode, mesh: Mesh, target: Mesh }[] = [];

export class NavigationMeshRecast implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // Casting to any will not be required in future versions of the recast plugin
        const recast = await Recast()
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);
        const navigationPlugin = new RecastJSPlugin(recast);
        navigationPlugin.setWorkerURL("./navMeshWorker.js");

        // This creates and positions a free camera (non-mesh)
        const camera = new FreeCamera("camera1", new Vector3(-6, 4, -8), scene);
        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());
        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        const staticMesh = createStaticMesh(scene);
        const navmeshParameters = {
            cs: 0.2,
            ch: 0.2,
            walkableSlopeAngle: 90,
            walkableHeight: 1.0,
            walkableClimb: 1,
            walkableRadius: 1,
            maxEdgeLen: 12.,
            maxSimplificationError: 1.3,
            minRegionArea: 8,
            mergeRegionArea: 20,
            maxVertsPerPoly: 6,
            detailSampleDist: 6,
            detailSampleMaxError: 1,
        };

        navigationPlugin.createNavMesh([staticMesh], navmeshParameters, (navmeshData) => {
            console.log("got worker data", navmeshData);
            navigationPlugin.buildFromNavmeshData(navmeshData);
            const navmeshdebug = navigationPlugin.createDebugNavMesh(scene);
            navmeshdebug.position = new Vector3(0, 0.01, 0);

            const matdebug = new StandardMaterial('matdebug', scene);
            matdebug.diffuseColor = new Color3(0.1, 0.2, 1);
            matdebug.alpha = 0.2;
            navmeshdebug.material = matdebug;

            // crowd
            const crowd = navigationPlugin.createCrowd(10, 0.1, scene);
            let i;
            const agentParams = {
                radius: 0.1,
                height: 0.2,
                maxAcceleration: 4.0,
                maxSpeed: 1.0,
                collisionQueryRange: 0.5,
                pathOptimizationRange: 0.0,
                separationWeight: 1.0
            };

            for (i = 0; i < 1; i++) {
                const width = 0.20;
                const agentCube = MeshBuilder.CreateBox("cube", { size: width, height: width }, scene);
                const targetCube = MeshBuilder.CreateBox("cube", { size: 0.1, height: 0.1 }, scene);
                const matAgent = new StandardMaterial('mat2', scene);
                const variation = Math.random();
                matAgent.diffuseColor = new Color3(0.4 + variation * 0.6, 0.3, 1.0 - variation * 0.3);
                agentCube.material = matAgent;
                const randomPos = navigationPlugin.getRandomPointAround(new Vector3(-2.0, 0.1, -1.8), 0.5);
                const transform = new TransformNode("transform");
                //agentCube.parent = transform;
                const agentIndex = crowd.addAgent(randomPos, agentParams, transform);
                agents.push({ idx: agentIndex, trf: transform, mesh: agentCube, target: targetCube });
            }

            let startingPoint: Vector3 | null;
            let currentMesh: AbstractMesh;
            let pathLine: LinesMesh;
            const getGroundPosition = function () {
                const pickinfo = scene.pick(scene.pointerX, scene.pointerY);
                if (pickinfo?.hit) {
                    return pickinfo.pickedPoint;
                }

                return null;
            }

            const pointerDown = function (mesh: AbstractMesh) {
                currentMesh = mesh;
                startingPoint = getGroundPosition();
                if (startingPoint) { // we need to disconnect camera from canvas
                    setTimeout(function () {
                        camera.detachControl();
                    }, 0);
                    const agents = crowd.getAgents();
                    let i;
                    for (i = 0; i < agents.length; i++) {
                        crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(startingPoint));
                    }
                    const pathPoints = navigationPlugin.computePath(crowd.getAgentPosition(agents[0]), navigationPlugin.getClosestPoint(startingPoint));
                    pathLine = MeshBuilder.CreateDashedLines("ribbon", { points: pathPoints, updatable: true, instance: pathLine }, scene);
                }
            }

            scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN:
                        if (pointerInfo?.pickInfo?.pickedMesh) {
                            console.log("pointer down", pointerInfo.pickInfo.pickedMesh.name);
                            pointerDown(pointerInfo.pickInfo.pickedMesh)
                        }
                        break;
                }
            });

            scene.onBeforeRenderObservable.add(() => {
                const agentCount = agents.length;
                for (let i = 0; i < agentCount; i++) {
                    const ag = agents[i];
                    ag.mesh.position = crowd.getAgentPosition(ag.idx);
                    const vel = crowd.getAgentVelocity(ag.idx);
                    crowd.getAgentNextTargetPathToRef(ag.idx, ag.target.position);
                    if (vel.length() > 0.2) {
                        vel.normalize();
                        const desiredRotation = Math.atan2(vel.x, vel.z);
                        ag.mesh.rotation.y = ag.mesh.rotation.y + (desiredRotation - ag.mesh.rotation.y) * 0.05;
                    }
                }
            });
        }); // worker
        return scene;
    };
}

function createStaticMesh(scene: Scene): Mesh {
    const ground = MeshBuilder.CreateGround("ground1", {
        width: 6,
        height: 6,
        subdivisions: 2
    }, scene);

    // Materials
    const mat1 = new StandardMaterial('mat1', scene);
    mat1.diffuseColor = new Color3(1, 1, 1);

    const sphere = MeshBuilder.CreateSphere("sphere1", { diameter: 2, segments: 16 }, scene);
    sphere.material = mat1;
    sphere.position.y = 1;

    const cube = MeshBuilder.CreateBox("cube", { size: 1, height: 3 }, scene);
    cube.position = new Vector3(1, 1.5, 0);
    //cube.material = mat2;

    const mesh = Mesh.MergeMeshes([sphere, cube, ground]);
    if (!mesh) {
        throw new Error("Could not merge meshes");
    }
    return mesh;
}

export default new NavigationMeshRecast();
