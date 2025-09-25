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

      // 🔥 CORRECTION : Adapter au format spécifique de votre API
      let itemsData: T[] = [];
      
      if (response && response.success && response.data) {
        // Format 1: response.data.services (format services API)
        if (response.data.services && Array.isArray(response.data.services)) {
          itemsData = response.data.services;
        }
        // Format 2: response.data.agencies (format agencies API)
        else if (response.data.agencies && Array.isArray(response.data.agencies)) {
          itemsData = response.data.agencies;
        }
        // Format 3: response.data.tenants (format tenants API)
        else if (response.data.tenants && Array.isArray(response.data.tenants)) {
          itemsData = response.data.tenants;
        }
        // Format 4: response.data.customers (format customers API)
        else if (response.data.customers && Array.isArray(response.data.customers)) {
          itemsData = response.data.customers;
        }
        // Format 5: response.data.orders (format orders API)
        else if (response.data.orders && Array.isArray(response.data.orders)) {
          itemsData = response.data.orders;
        }
        // Format 6: response.data.users (format users API)
        else if (response.data.users && Array.isArray(response.data.users)) {
          itemsData = response.data.users;
        }
        // Format 7: response.data.tasks (format tasks API)
        else if (response.data.tasks && Array.isArray(response.data.tasks)) {
          itemsData = response.data.tasks;
        }
        // Format 8: response.data.notifications (format notifications API)
        else if (response.data.notifications && Array.isArray(response.data.notifications)) {
          itemsData = response.data.notifications;
        }
        // Format 9: response.data.promotions (format promotions API)
        else if (response.data.promotions && Array.isArray(response.data.promotions)) {
          itemsData = response.data.promotions;
        }
        // Format 10: response.data.billing (format billing API)
        else if (response.data.billing && Array.isArray(response.data.billing)) {
          itemsData = response.data.billing;
        }
        // Format 11: response.data.loyalty (format loyalty API)
        else if (response.data.loyalty && Array.isArray(response.data.loyalty)) {
          itemsData = response.data.loyalty;
        }
        // Format 12: response.data.conversations (format messages API)
        else if (response.data.conversations && Array.isArray(response.data.conversations)) {
          itemsData = response.data.conversations;
        }
        // Format 13: response.data.inventory (format inventory API)
        else if (response.data.inventory && Array.isArray(response.data.inventory)) {
          itemsData = response.data.inventory;
        }
        // Format 14: response.data.suppliers (format suppliers API)
        else if (response.data.suppliers && Array.isArray(response.data.suppliers)) {
          itemsData = response.data.suppliers;
        }
        // Format 15: response.data.countries (format countries API)
        else if (response.data.countries && Array.isArray(response.data.countries)) {
          itemsData = response.data.countries;
        }
        // Format 16: response.data.data (format standard)
        else if (response.data.data && Array.isArray(response.data.data)) {
          itemsData = response.data.data;
        }
        // Format 17: response.data.items (autre format courant)
        else if (response.data.items && Array.isArray(response.data.items)) {
          itemsData = response.data.items;
        }
        // Format 18: response.data est directement un tableau
        else if (Array.isArray(response.data)) {
          itemsData = response.data;
        }
        // Format 19: response est directement un tableau
        else if (Array.isArray(response)) {
          itemsData = response;
        }
        else {
          console.warn('Unexpected response format:', response);
          itemsData = [];
        }
      } else {
        console.warn('API response indicates failure:', response);
        throw new Error(response?.error || `Erreur API: ${entityName}`);
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

  // CRUD operations - CORRECTION pour gérer le format de réponse
  const handleCreate = useCallback(async (data: Partial<T>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await service.createItem(data);
      
      // 🔥 CORRECTION : Vérifier le succès de la réponse
      if (response && response.success) {
        await loadData();
        setIsCreateModalOpen(false);
      } else {
        throw new Error(response?.error || `Erreur lors de la création de ${entityName}`);
      }
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
      const response = await service.updateItem(id, data);
      
      // 🔥 CORRECTION : Vérifier le succès de la réponse
      if (response && response.success) {
        await loadData();
        setIsEditModalOpen(false);
        setSelectedItem(null);
      } else {
        throw new Error(response?.error || `Erreur lors de la modification de ${entityName}`);
      }
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
      const response = await service.deleteItem(id);
      
      // 🔥 CORRECTION : Vérifier le succès de la réponse
      if (response && response.success) {
        await loadData();
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
      } else {
        throw new Error(response?.error || `Erreur lors de la suppression de ${entityName}`);
      }
    } catch (err: any) {
      setError(err.message || `Erreur lors de la suppression de ${entityName}`);
    } finally {
      setIsLoading(false);
    }
  }, [service, entityName, loadData]);

  // Modal functions (inchangées)
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
    setIsDeleteModalOpen(false);
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