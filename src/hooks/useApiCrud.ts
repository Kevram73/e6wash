import { useState, useEffect, useCallback } from 'react';

interface UseApiCrudSimpleOptions {
  service: any;
  entityName: string;
}

interface UseApiCrudSimpleReturn<T> {
  items: T[];
  selectedItem: T | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  handleCreate: (data: Partial<T>) => Promise<void>;
  handleEdit: (id: string, data: Partial<T>) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleView: (item: T) => void;
  openCreateModal: () => void;
  openEditModal: (item: T) => void;
  openDeleteModal: (item: T) => void;
  closeModals: () => void;
  setItems: (items: T[]) => void;
}

export function useApiCrudSimple<T extends { id: string }>({
  service,
  entityName,
}: UseApiCrudSimpleOptions): UseApiCrudSimpleReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading ${entityName} data...`);
      const response = await service.getItems();
      console.log(`${entityName} data loaded:`, response);

      // 🔥 CORRECTION : Accepter différents formats de réponse
      let itemsData: T[] = [];
      
      if (Array.isArray(response)) {
        itemsData = response;
      } else if (response && Array.isArray(response.data)) {
        itemsData = response.data;
      } else if (response && Array.isArray(response.items)) {
        itemsData = response.items;
      } else {
        console.warn('Unexpected response format:', response);
        itemsData = [];
      }
      
      setItems(itemsData);
      console.log(`Set ${itemsData.length} ${entityName} items`);
    } catch (err: any) {
      const errorMessage = err.message || `Erreur lors du chargement des ${entityName}`;
      setError(errorMessage);
      console.error(`Error loading ${entityName}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [service, entityName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CRUD operations
  const handleCreate = useCallback(async (data: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await service.createItem(data);
      await loadData();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      setError(err.message || `Erreur lors de la création de ${entityName}`);
    } finally {
      setIsLoading(false);
    }
  }, [service, entityName, loadData]);

  const handleEdit = useCallback(async (id: string, data: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await service.updateItem(id, data);
      await loadData();
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      setError(err.message || `Erreur lors de la modification de ${entityName}`);
    } finally {
      setIsLoading(false);
    }
  }, [service, entityName, loadData]);

  const handleDelete = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await service.deleteItem(id);
      await loadData();
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      setError(err.message || `Erreur lors de la suppression de ${entityName}`);
    } finally {
      setIsLoading(false);
    }
  }, [service, entityName, loadData]);

  // Modal functions
  const handleView = useCallback((item: T) => {
    setSelectedItem(item);
  }, []);

  const openCreateModal = useCallback(() => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  }, []);

  const openEditModal = useCallback((item: T) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
    setIsCreateModalOpen(false);
    setIsDeleteModalOpen(false);
  }, []);

  const openDeleteModal = useCallback((item: T) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  }, []);

  const closeModals = useCallback(() => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    setError(null);
  }, []);

  return {
    items,
    selectedItem,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isLoading,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleView,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    setItems,
  };
}