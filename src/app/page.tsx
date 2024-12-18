"use client"

import { useState } from "react";
import Sidebar from "@/components/SideBar";
import Canvas from "@/components/Canvas";
export default function Home() {
  const [activeScene, setActiveScene] = useState("cube");

  function handleSceneChange(scene: string) {
    setActiveScene(scene);
  }

  return (
    <div className="flex w-full">
      <Sidebar activeScene={activeScene} onSceneChange={handleSceneChange}/>
      <Canvas scene={activeScene}/>
    </div>
  );
}