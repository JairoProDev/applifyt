'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import {
  User,
  Bell,
  Lock,
  Globe,
  Database,
  Save,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    timezone: 'UTC',
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    habitReminders: true,
    weeklyReviewReminder: true,
    goalDeadlineReminders: true,
    dailyCheckInReminder: true,
  })

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        bio: '',
        timezone: 'UTC',
      })
    }
  }, [session])

  if (status === 'loading') {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      await update({ name: profileData.name })
      toast.success('Perfil actualizado exitosamente')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings),
      })

      if (!response.ok) throw new Error('Failed to update notifications')

      toast.success('Preferencias de notificación actualizadas')
    } catch (error) {
      console.error('Error updating notifications:', error)
      toast.error('Error al actualizar las notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Contraseña cambiada exitosamente')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error instanceof Error ? error.message : 'Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/export')

      if (!response.ok) throw new Error('Failed to export data')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `applifyt-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Datos exportados exitosamente')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Error al exportar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y todos tus datos serán eliminados permanentemente.'
    )

    if (!confirmed) return

    const doubleConfirmed = window.confirm(
      '¿Estás absolutamente seguro? Escribe "ELIMINAR" en la próxima confirmación para proceder.'
    )

    if (!doubleConfirmed) return

    try {
      setLoading(true)
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete account')

      toast.success('Cuenta eliminada exitosamente')
      router.push('/auth/signin')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Error al eliminar la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const timezones = [
    { value: 'UTC', label: 'UTC (Tiempo Universal Coordinado)' },
    { value: 'America/New_York', label: 'América/Nueva York (EST)' },
    { value: 'America/Chicago', label: 'América/Chicago (CST)' },
    { value: 'America/Denver', label: 'América/Denver (MST)' },
    { value: 'America/Los_Angeles', label: 'América/Los Ángeles (PST)' },
    { value: 'America/Mexico_City', label: 'América/Ciudad de México' },
    { value: 'America/Bogota', label: 'América/Bogotá' },
    { value: 'America/Santiago', label: 'América/Santiago' },
    { value: 'America/Argentina/Buenos_Aires', label: 'América/Buenos Aires' },
    { value: 'Europe/London', label: 'Europa/Londres' },
    { value: 'Europe/Paris', label: 'Europa/París' },
    { value: 'Europe/Madrid', label: 'Europa/Madrid' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokio' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghái' },
    { value: 'Australia/Sydney', label: 'Australia/Sídney' },
  ]

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">
            Administra tu perfil, preferencias y configuración de la cuenta
          </p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-600" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <Input
                  id="name"
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  El correo electrónico no se puede cambiar en este momento
                </p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía (Opcional)
                </label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Zona Horaria
                </label>
                <select
                  id="timezone"
                  value={profileData.timezone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="input w-full"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={loading} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary-600" />
              Notificaciones
            </CardTitle>
            <p className="text-sm text-gray-600">
              Configura cómo y cuándo quieres recibir notificaciones
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNotificationUpdate} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      emailNotifications: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Notificaciones por Email</div>
                    <div className="text-xs text-gray-500">Recibe actualizaciones por correo electrónico</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.habitReminders}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      habitReminders: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Recordatorios de Hábitos</div>
                    <div className="text-xs text-gray-500">Recibe recordatorios para tus hábitos diarios</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.dailyCheckInReminder}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      dailyCheckInReminder: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Recordatorio de Check-in Diario</div>
                    <div className="text-xs text-gray-500">Recibe un recordatorio para tu check-in diario</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyReviewReminder}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      weeklyReviewReminder: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Recordatorio de Revisión Semanal</div>
                    <div className="text-xs text-gray-500">Recibe recordatorios para tu revisión semanal</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.goalDeadlineReminders}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      goalDeadlineReminders: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Recordatorios de Fechas Límite</div>
                    <div className="text-xs text-gray-500">Recibe alertas cuando se acerquen las fechas límite de tus metas</div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button type="submit" loading={loading} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary-600" />
              Seguridad
            </CardTitle>
            <p className="text-sm text-gray-600">
              Cambia tu contraseña para mantener tu cuenta segura
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Actual
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button type="submit" loading={loading} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary-600" />
              Datos y Privacidad
            </CardTitle>
            <p className="text-sm text-gray-600">
              Administra tus datos personales y configuración de privacidad
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">Exportar Datos</h4>
                <p className="text-sm text-blue-700">
                  Descarga todos tus datos en formato JSON
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                loading={loading}
                disabled={loading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex-1">
                <h4 className="font-medium text-red-900">Eliminar Cuenta</h4>
                <p className="text-sm text-red-700">
                  Elimina permanentemente tu cuenta y todos tus datos
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                loading={loading}
                disabled={loading}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Privacidad y Seguridad
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Tus datos están encriptados en tránsito y en reposo</li>
                <li>• Nunca compartimos tu información con terceros</li>
                <li>• Puedes exportar o eliminar tus datos en cualquier momento</li>
                <li>• Cumplimos con GDPR y otras regulaciones de privacidad</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
