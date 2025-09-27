import React, { useState, useEffect } from 'react';
import { UserFormData, UserRole, User } from '@/lib/types/user-management';
import { usersService } from '@/lib/api/services/users';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkInput from '@/components/ui/UpworkInput';
import { 
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Building2,
  Shield,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSuccess, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    agencyId: '',
    isActive: true
  });

  const [roles, setRoles] = useState<UserRole[]>([]);
  const [agencies, setAgencies] = useState<Array<{ id: string; name: string }>>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!user;

  useEffect(() => {
    loadRoles();
    loadAgencies();
    
    if (user) {
      setFormData({
        fullname: user.fullname,
        email: user.email,
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        roleId: user.role.id,
        agencyId: user.agency?.id || '',
        isActive: user.isActive
      });
    }
  }, [user]);

  const loadRoles = async () => {
    try {
      const response = await usersService.getRoles();
      if (response.success) {
        setRoles(response.data || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
    }
  };

  const loadAgencies = async () => {
    try {
      // Ici, vous appelleriez l'API pour récupérer les agences
      // Pour l'instant, on utilise des données mockées
      setAgencies([
        { id: '1', name: 'Agence Principale' },
        { id: '2', name: 'Agence Secondaire' }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des agences:', error);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Le nom complet est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Le rôle est requis';
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Le mot de passe est requis';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        roleId: formData.roleId,
        agencyId: formData.agencyId || undefined,
        isActive: formData.isActive
      };

      if (isEditing && user) {
        await usersService.updateUser(user.id, userData);
      } else {
        await usersService.createUser(userData);
      }

      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde de l\'utilisateur' });
    }
  };

  const getRoleIcon = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.icon || 'user';
  };

  const getRoleColor = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-[#14a800] rounded-xl flex items-center justify-center mb-4">
          <UserIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#2c2c2c] mb-2">
          {isEditing ? 'Modifier l\'Utilisateur' : 'Créer un Utilisateur'}
        </h2>
        <p className="text-[#525252]">
          {isEditing ? 'Modifiez les informations de l\'utilisateur' : 'Ajoutez un nouvel utilisateur à votre équipe'}
        </p>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UpworkInput
            label="Nom complet *"
            value={formData.fullname}
            onChange={(e) => handleInputChange('fullname', e.target.value)}
            placeholder="Prénom Nom"
            error={errors.fullname}
            required
          />
        </div>
        <div>
          <UpworkInput
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="utilisateur@exemple.com"
            error={errors.email}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UpworkInput
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+237 123 456 789"
            error={errors.phone}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
            Rôle *
          </label>
          <select
            value={formData.roleId}
            onChange={(e) => handleInputChange('roleId', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200 ${
              errors.roleId ? 'border-red-300' : 'border-[#e5e5e5]'
            }`}
            required
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} - {role.description}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="mt-1 text-sm text-red-600">{errors.roleId}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
          Agence
        </label>
        <select
          value={formData.agencyId}
          onChange={(e) => handleInputChange('agencyId', e.target.value)}
          className="w-full px-4 py-2.5 border border-[#e5e5e5] rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200"
        >
          <option value="">Aucune agence spécifique</option>
          {agencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.name}
            </option>
          ))}
        </select>
      </div>

      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
              Mot de passe *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mot de passe sécurisé"
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200 ${
                  errors.password ? 'border-red-300' : 'border-[#e5e5e5]'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] hover:text-[#2c2c2c] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirmer le mot de passe"
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-[#e5e5e5]'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] hover:text-[#2c2c2c] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      )}

      {isEditing && formData.password && (
        <div>
          <label className="block text-sm font-medium text-[#2c2c2c] mb-2">
            Nouveau mot de passe (optionnel)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Laisser vide pour conserver le mot de passe actuel"
              className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-[#2c2c2c] placeholder-[#a3a3a3] focus:outline-none focus:ring-2 focus:ring-[#14a800] focus:border-transparent transition-colors duration-200 ${
                errors.password ? 'border-red-300' : 'border-[#e5e5e5]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a3a3a3] hover:text-[#2c2c2c] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="h-4 w-4 text-[#14a800] focus:ring-[#14a800] border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-[#2c2c2c]">
          Utilisateur actif
        </label>
      </div>

      {/* Aperçu du rôle sélectionné */}
      {formData.roleId && (
        <div className="bg-[#f9f9f9] p-4 rounded-lg">
          <h3 className="font-medium text-[#2c2c2c] mb-2">Aperçu du rôle</h3>
          {(() => {
            const selectedRole = roles.find(r => r.id === formData.roleId);
            return selectedRole ? (
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedRole.color}`}>
                  {selectedRole.name}
                </span>
                <span className="text-sm text-[#525252]">{selectedRole.description}</span>
              </div>
            ) : null;
          })()}
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-6">
        <UpworkButton
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Annuler
        </UpworkButton>
        <UpworkButton
          type="submit"
          disabled={isLoading}
        >
          <Check className="h-4 w-4 mr-2" />
          {isLoading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer')}
        </UpworkButton>
      </div>
    </form>
  );
};

export default UserForm;
