import './style.css'

import * as THREE from "three";
import * as BUI from "@thatopen/ui";
// import Stats from "stats.js";
import * as OBC from "@thatopen/components";

const container = document.getElementById("container")!;

const components = new OBC.Components();

const worlds = components.get(OBC.Worlds);

const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
>();

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

components.init();

world.camera.controls.setLookAt(12,6,8, 0,0,-10);

world.scene.setup();

const grids = components.get(OBC.Grids);

grids.create(world);

// npm run dev here 


world.scene.three.background =  null;

const material = new THREE.MeshLambertMaterial({ color: "#6528D7" });
const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, material);
world.scene.three.add(cube);

// npm run dev here 
// IfcLoader https://docs.thatopen.com/Tutorials/Components/Core/IfcLoader

const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);
await fragmentIfcLoader.setup();

fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

async function loadIfc() {
  const file = await fetch(
    "https://thatopen.github.io/engine_components/resources/small.ifc",
  );
  const data = await file.arrayBuffer();
  const buffer = new Uint8Array(data);
  const model = await fragmentIfcLoader.load(buffer);
  // model.name = "example";
  world.scene.three.add(model);
}

fragments.onFragmentsLoaded.add((model) => {
  console.log(model);
});


BUI.Manager.init();

const panel = BUI.Component.create<BUI.PanelSection>(() => {
  return BUI.html`
  <bim-panel active label="IFC Loader Tutorial" class="options-menu">
    <bim-panel-section collapsed label="Controls">
      <bim-panel-section style="padding-top: 12px;">
      
        <bim-button label="Load IFC"
          @click="${() => {
            loadIfc();
          }}">
        </bim-button>  
            

      
      </bim-panel-section>
      
    </bim-panel>
  `;
});

document.body.append(panel);





