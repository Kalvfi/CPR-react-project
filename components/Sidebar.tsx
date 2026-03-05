export default function Sidebar() {
	return (
		<aside className="w-64 border-r bg-gray-50 p-4 hidden md:flex flex-col gap-4">
			<div>
				<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
					Main Menu
				</h3>
				<ul className="space-y-1">
					<li className="p-2 bg-blue-50 text-blue-700 rounded font-medium cursor-pointer">
						Boards
					</li>
					<li className="p-2 hover:bg-gray-200 rounded cursor-pointer text-gray-700">
						Templates
					</li>
					<li className="p-2 hover:bg-gray-200 rounded cursor-pointer text-gray-700">
						Home
					</li>
				</ul>
			</div>
			<div className="mt-4">
				<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
					Your Workspaces
				</h3>
				<div className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer text-sm">
					<div className="w-6 h-6 bg-purple-500 rounded text-white flex items-center justify-center text-[10px]">
						P
					</div>
					Personal Project
				</div>
			</div>
		</aside>
	);
}
