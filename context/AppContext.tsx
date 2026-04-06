'use client';

import { Board } from '@/types/types';
import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';

interface AppContextType {
	boards: Board[];
	refetchBoards: () => void;
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
	const [boards, setBoards] = useState<Board[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const fetchBoards = () => {
		fetch('/api/boards')
			.then((res) => res.json())
			.then(setBoards)
			.catch(console.error);
	};

	useEffect(() => {
		fetchBoards();
	}, []);

	return (
		<AppContext.Provider
			value={{
				boards,
				refetchBoards: fetchBoards,
				isModalOpen,
				openModal: () => setIsModalOpen(true),
				closeModal: () => setIsModalOpen(false),
			}}>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (context == undefined)
		throw new Error('useAppContext must be used within an AppProvider');
	return context;
}
