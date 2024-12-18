interface SidebarProps {
  onSceneChange: (scene: string) => void
  activeScene: string
}

const scenes = [
  { id: 'cube', name: 'Rotating Cube' },
  { id: 'sphere', name: 'Colored Sphere' },
  { id: 'torus', name: 'Torus Knot' },
]

export default function Sidebar({ onSceneChange, activeScene }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-6">3D Scenes</h2>
      <nav>
        <ul className="space-y-2">
          {scenes.map((scene) => (
            <li key={scene.id}>
              <button
                onClick={() => onSceneChange(scene.id)}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeScene === scene.id
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                {scene.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
