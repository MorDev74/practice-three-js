"use client"

import { useState } from "react";
import Sidebar from "@/components/SideBar";
import Canvas from "@/components/Canvas";
import { ModelType } from "@/types/model";

export default function Home() {
  const [activeModels, setActiveModels] = useState<ModelType[]>([]);
  function toggleModel(modelType: ModelType) {
    setActiveModels(prev => {
      if (prev.includes(modelType)) {
        return prev.filter(type => type !== modelType);
      }
      return [...prev, modelType];
    });
  }

  return (
    <div className="flex w-full">
      <Sidebar onModelToggle={toggleModel}/>
      <Canvas activeModels={activeModels}/>
    </div>
  );
}