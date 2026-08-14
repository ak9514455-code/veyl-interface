import { useEffect, useRef } from "react";
import * as THREE from "three";

export type GridScanProps = {
  linesColor?: string;
  lineThickness?: number;
  sensitivity?: number;
  className?: string;
};

export default function GridScan({ linesColor = "#2F293A", lineThickness = 1, sensitivity = 0.6, className }: GridScanProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(0, width, height, 0, -1000, 1000);
    camera.position.z = 10;

    // Create grid lines
    // Prevent creating multiple canvases/renderers on HMR reruns
    if (container.querySelector("canvas")) {
      // Already initialized by previous HMR run; skip re-creating heavy resources
      return;
    }

    const g = new THREE.Group();
    // denser grid but capped: smaller spacing -> higher density, but cap number of lines
    const maxLines = 80; // lower cap for memory
    const spacing = Math.max(10, Math.floor(Math.min(width, height) / 28));

    // create vertical lines (cap iterations)
    let count = 0;
    for (let x = 0; x < width && count < maxLines; x += spacing, count++) {
      const material = new THREE.LineBasicMaterial({ color: new THREE.Color(linesColor), linewidth: lineThickness, transparent: true, opacity: 0.24 });
      const points = [new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, height, 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, material as any);
      g.add(line);
    }

    // horizontal lines (cap iterations)
    count = 0;
    for (let y = 0; y < height && count < maxLines; y += spacing, count++) {
      const material = new THREE.LineBasicMaterial({ color: new THREE.Color(linesColor), linewidth: lineThickness, transparent: true, opacity: 0.24 });
      const points = [new THREE.Vector3(0, y, 0), new THREE.Vector3(width, y, 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, material as any);
      g.add(line);
    }

    scene.add(g);

    container.appendChild(renderer.domElement);

    // scan line
    const scanMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x7c5cff), transparent: true, opacity: 0.2 });
    const scanGeo = new THREE.PlaneGeometry(width, 56);
    const scanMesh = new THREE.Mesh(scanGeo, scanMat);
    scanMesh.position.set(width / 2, -28, 0);
    scene.add(scanMesh);

    let t = 0;
    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.right = w;
      camera.top = h;
      camera.updateProjectionMatrix();
    }

    function animate() {
      t += 0.008 * (0.6 + sensitivity);
      const y = (Math.sin(t) * 0.5 + 0.5) * (height + 120) - 60;
      scanMesh.position.y = y;

      // subtle shimmer on grid: oscillate material opacity
      (g.children as THREE.Object3D[]).forEach((c, i) => {
        const mat = (c as any).material as THREE.LineBasicMaterial | undefined;
        if (mat) mat.opacity = 0.36 + 0.08 * Math.sin(t * 1.2 + i);
      });

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      scene.traverse((o) => {
        if ((o as any).geometry) (o as any).geometry.dispose();
        if ((o as any).material) (o as any).material.dispose();
      });
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [linesColor, lineThickness, sensitivity]);

  return <div ref={ref} className={className ?? "absolute inset-0 pointer-events-none"} />;
}
