import { Pencil, Trash } from 'lucide-react';

interface ActionMenuProps {
	onRename: () => void;
	onDelete: () => void;
	type: 'board' | 'column' | 'card';
	className?: string;
}

export default function ActionMenu({
	onRename,
	onDelete,
	type,
	className = 'absolute right-2 top-2',
}: ActionMenuProps) {
	return (
		<div
			className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-zinc-800 shadow-sm p-1 rounded-md border border-zinc-200 dark:border-zinc-700 z-10 ${className}`}
			onPointerDown={(e) => e.stopPropagation()}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onRename();
				}}
				className="p-1 text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400 rounded transition"
				aria-label={`Rename ${type}`}>
				<Pencil size={14} />
			</button>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				className="p-1 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:text-zinc-400 dark:hover:text-red-400 rounded transition"
				aria-label={`Delete ${type}`}>
				<Trash size={14} />
			</button>
		</div>
	);
}
