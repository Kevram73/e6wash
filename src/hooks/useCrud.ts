import { useState, useCallback } from 'react';

interface CrudState<T> {
  items: T[];
  selectedItem: T | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface CrudActions<T> {
  // State setters
  setItems: (items: T[]) => void;
  setSelectedItem: (item: T | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // CRUD operations
  handleCreate: (item: Omit<T, 'id'>) => Promise<void>;
  handleEdit: (id: string, item: Partial<T>) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleView: (item: T) => void;
  
  // Modal handlers
  openCreateModal: () => void;
  openEditModal: (item: T) => void;
  openDeleteModal: (item: T) => void;
  closeModals: () => void;
}

export function useCrud<T extends { id: string }>(
  initialItems: T[] = []
): CrudState<T> & CrudActions<T> {
  const [state, setState] = useState<CrudState<T>>({
    items: initialItems,
    selectedItem: null,
    isCreateModalOpen: false,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    isLoading: false,
    error: null,
  });

  const setItems = useCallback((items: T[]) => {
    setState(prev => ({ ...prev, items }));
  }, []);

  const setSelectedItem = useCallback((item: T | null) => {
    setState(prev => ({ ...prev, selectedItem: item }));
  }, []);

  const setIsCreateModalOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isCreateModalOpen: open }));
  }, []);

  const setIsEditModalOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isEditModalOpen: open }));
  }, []);

  const setIsDeleteModalOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isDeleteModalOpen: open }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const handleCreate = useCallback(async (item: Omit<T, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItem = {
        ...item,
        id: Date.now().toString(), // Simple ID generation
      } as T;
      
      setItems(prev => [...prev, newItem]);
      setIsCreateModalOpen(false);
    } catch (error) {
      setError('Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsCreateModalOpen, setIsLoading, setError]);

  const handleEdit = useCallback(async (id: string, item: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      setError('Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsEditModalOpen, setSelectedItem, setIsLoading, setError]);

  const handleDelete = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setItems(prev => prev.filter(i => i.id !== id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      setError('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  }, [setItems, setIsDeleteModalOpen, setSelectedItem, setIsLoading, setError]);

  const handleView = useCallback((item: T) => {
    setSelectedItem(item);
    // You can add a view modal here if needed
  }, [setSelectedItem]);

  const openCreateModal = useCallback(() => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  }, [setSelectedItem, setIsCreateModalOpen, setIsEditModalOpen, setIsDeleteModalOpen]);

  const openEditModal = useCallback((item: T) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
  }, [setSelectedItem, setIsEditModalOpen, setIsCreateModalOpen, setIsDeleteModalOpen]);

  const openDeleteModal = useCallback((item: T) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  }, [setSelectedItem, setIsDeleteModalOpen, setIsCreateModalOpen, setIsEditModalOpen]);

  const closeModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    setError(null);
  }, [setIsCreateModalOpen, setIsEditModalOpen, setIsDeleteModalOpen, setSelectedItem, setError]);

  return {
    ...state,
    setItems,
    setSelectedItem,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    setIsLoading,
    setError,
    handleCreate,
    handleEdit,
    handleDelete,
    handleView,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModals,
  };
}
