import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
	className = '',
}: ActionMenuProps) {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div
			ref={menuRef}
			className={`relative shrink-0 ${className}`}
			onPointerDown={(e) => e.stopPropagation()}>
			<button
				onClick={(e) => {
					e.stopPropagation();
					setOpen((prev) => !prev);
				}}
				className="
					flex h-7 w-7 items-center justify-center
					rounded-md transition
					text-zinc-500 hover:text-zinc-200
					hover:bg-white/10
				"
				aria-label={`${type} actions`}>
				<EllipsisVertical size={16} />
			</button>

			{open && (
				<div
					className="
						absolute right-0 top-full mt-1
						w-36 overflow-hidden
						rounded-xl border
						border-zinc-700
						bg-zinc-900
						shadow-xl
						z-50
					">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onRename();
							setOpen(false);
						}}
						className="
							flex w-full items-center gap-2
							px-3 py-2 text-sm
							text-zinc-200
							hover:bg-zinc-800
							transition
						">
						<Pencil size={14} />
						Rename
					</button>

					<button
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
							setOpen(false);
						}}
						className="
							flex w-full items-center gap-2
							px-3 py-2 text-sm
							text-red-400
							hover:bg-zinc-800
							transition
						">
						<Trash size={14} />
						Delete
					</button>
				</div>
			)}
		</div>
	);
}
