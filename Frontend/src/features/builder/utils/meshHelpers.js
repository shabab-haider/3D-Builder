import * as THREE from "three";

export function findMeshByName(scene, meshName) {
  let found = null;
  scene.traverse((child) => {
    if (child.isMesh && (child.name || child.uuid) === meshName) {
      found = child;
    }
  });
  return found;
}

export function getBiggestMeshName(scene) {
  let biggestName = null;
  let maxVolume = 0;

  scene.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;

    const box = new THREE.Box3().setFromObject(child);
    const size = new THREE.Vector3();
    box.getSize(size);
    const volume = size.x * size.y * size.z;
    const name = child.name || child.uuid;

    if (volume > maxVolume) {
      maxVolume = volume;
      biggestName = name;
    }
  });

  return biggestName;
}

/** Build position + quaternion so a +Z-facing plane sits on the mesh surface */
export function placementFromHit(mesh, hit) {
  // hit.point is in world space — convert to mesh local space
  const worldNormal = hit.face.normal
    .clone()
    .transformDirection(hit.object.matrixWorld)
    .normalize();

  const worldPos = hit.point.clone().addScaledVector(worldNormal, 0.008);
  const localPos = mesh.worldToLocal(worldPos);

  const invMatrix = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
  const localNormal = worldNormal.clone().transformDirection(invMatrix).normalize();

  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    localNormal
  );

  return {
    position: [localPos.x, localPos.y, localPos.z],
    quaternion: [quat.x, quat.y, quat.z, quat.w],
  };
}

/** Ray from default camera (model is centered at origin) onto mesh front */
export function getPlacementOnMesh(mesh) {
  if (!mesh) {
    return {
      position: [0, 0, 0.02],
      quaternion: [0, 0, 0, 1],
    };
  }

  mesh.updateWorldMatrix(true, true);

  const raycaster = new THREE.Raycaster();
  raycaster.set(
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(0, 0, -1)
  );

  const hits = raycaster.intersectObject(mesh, false);
  const surfaceHit = hits.find((h) => !h.object.userData?.isOverlay);

  if (surfaceHit) {
    return placementFromHit(mesh, surfaceHit);
  }

  // Fallback: front center of the bounding box projected to mesh local space
  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  // Use frontmost Z of the bounding box
  const frontPoint = new THREE.Vector3(center.x, center.y, box.max.z + 0.05);
  const localPos = mesh.worldToLocal(frontPoint.clone());

  const invMatrix = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
  const localNormal = new THREE.Vector3(0, 0, 1).transformDirection(invMatrix).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    localNormal
  );

  return {
    position: [localPos.x, localPos.y, localPos.z],
    quaternion: [quat.x, quat.y, quat.z, quat.w],
  };
}

export function getPlacementFromScreen(scene, camera, clientX, clientY, domElement) {
  if (!scene || !camera || !domElement) return null;

  scene.updateWorldMatrix(true, true);

  const rect = domElement.getBoundingClientRect();
  const pointer = new THREE.Vector2(
    ((clientX - rect.left) / rect.width) * 2 - 1,
    -((clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(scene.children, true);
  const surfaceHit = hits.find((h) => h.object.isMesh && !h.object.userData?.isOverlay);

  if (surfaceHit) {
    const hitMesh = surfaceHit.object;
    const placement = placementFromHit(hitMesh, surfaceHit);
    return {
      ...placement,
      meshName: hitMesh.name || hitMesh.uuid,
    };
  }

  return null;
}
