import { Model, ModelType } from "@/types/model";

interface SidebarProps {
  onModelToggle: (modelType: ModelType) => void;
}

export default function Sidebar({ onModelToggle }: SidebarProps) {
  const models: Model[] = [
    { id: 'cube', name: 'Rotating Cube' },
    { id: 'sphere', name: 'Colored Sphere' },
    { id: 'cylinder', name: 'Cylinder' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-6">3D Models</h2>
      <nav>
        <ul className="space-y-2">
          {models.map((model) => (
            <li key={model.id}>
              <button
                onClick={() => onModelToggle(model.id)}
                className={`w-full text-left px-4 py-2 rounded`}
              >
                {model.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
