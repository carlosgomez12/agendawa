import { createClient } from '@supabase/supabase-js'

// Proyecto Supabase real de AgendaWA.
// La "anon key" está pensada para exponerse en el frontend: el acceso real
// a los datos está protegido por las políticas de Row Level Security que
// ya quedaron activas en cada tabla (cada usuario solo ve lo suyo).
const FALLBACK_URL = 'https://jscmbbpyzreceygkidfg.supabase.co'
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzY21iYnB5enJlY2V5Z2tpZGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDYyNjAsImV4cCI6MjEwMzg4MjI2MH0.jhPeY3_Lr2c6bSMWE_ieVOi9VQ7QJ8zfEqodtoKXJr4'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || FALLBACK_URL
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || FALLBACK_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Nicho = 'mecanico' | 'fontanero' | 'entrenador' | 'limpieza' | 'otro'

export interface Profile {
  id: string
  nombre_negocio: string | null
  telefono: string | null
  nicho: Nicho
  plan: 'free' | 'pro'
  calendar_token: string
  created_at: string
}

export type EstadoSuscripcion = 'en_prueba' | 'activa' | 'cancelada'

export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'pro'
  estado: EstadoSuscripcion
  trial_ends_at: string | null
  periodo_actual_fin: string | null
  created_at: string
}

export type EstadoPipeline =
  | 'contacto_inicial'
  | 'cita_programada'
  | 'en_servicio'
  | 'finalizado_cobrado'

export interface Contact {
  id: string
  user_id: string
  nombre: string
  telefono: string
  servicio: string | null
  notas: string | null
  estado_pipeline: EstadoPipeline
  created_at: string
  updated_at: string
}

export const ETAPAS: { key: EstadoPipeline; label: string }[] = [
  { key: 'contacto_inicial', label: 'Contacto inicial' },
  { key: 'cita_programada', label: 'Cita programada' },
  { key: 'en_servicio', label: 'En servicio' },
  { key: 'finalizado_cobrado', label: 'Finalizado / Cobrado' },
]

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
export type EstadoPago = 'pendiente' | 'pagado'

export interface Appointment {
  id: string
  user_id: string
  contact_id: string | null
  servicio: string | null
  fecha_hora: string
  estado: EstadoCita
  estado_pago: EstadoPago
  precio: number | null
  created_at: string
  confirmacion_enviada: boolean
  recordatorio_24h_enviado: boolean
  recordatorio_2h_enviado: boolean
  seguimiento_enviado: boolean
  token_publico: string
  solicito_reprogramar: boolean
  wompi_payment_link_id: string | null
  // Viene del join con contacts
  contacts?: { nombre: string; telefono: string } | null
}

/** Construye un enlace wa.me con número e mensaje ya redactado. */
export function enlaceWhatsApp(telefono: string, mensaje: string) {
  const numero = telefono.replace(/[^0-9]/g, '')
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}

export type TipoPlantilla =
  | 'confirmacion'
  | 'recordatorio_24h'
  | 'recordatorio_2h'
  | 'seguimiento'
  | 'cobro'

export const PLANTILLAS_INFO: { key: TipoPlantilla; label: string }[] = [
  { key: 'confirmacion', label: 'Confirmación de cita' },
  { key: 'recordatorio_24h', label: 'Recordatorio 24h antes' },
  { key: 'recordatorio_2h', label: 'Recordatorio 2h antes' },
  { key: 'seguimiento', label: 'Seguimiento post-servicio' },
  { key: 'cobro', label: 'Solicitud de cobro' },
]

export const PLANTILLAS_DEFAULT: Record<TipoPlantilla, string> = {
  confirmacion:
    '¡Hola {nombre}! Confirmamos tu cita de {servicio} para el {fecha} a las {hora}. Cualquier cosa me escribes por aquí. 🙌',
  recordatorio_24h:
    '¡Hola {nombre}! Te recuerdo tu cita de {servicio} mañana {fecha} a las {hora}. Si necesitas cancelar o reprogramar, entra aquí: {enlace}',
  recordatorio_2h:
    '¡Hola {nombre}! En un par de horas tenemos tu cita de {servicio} a las {hora}. Nos vemos pronto — si necesitas cancelar o reprogramar, entra aquí: {enlace}',
  seguimiento:
    '¡Hola {nombre}! Ya terminamos tu servicio de {servicio} 🙌 ¿Todo quedó bien? Si tienes un minuto, me ayudarías muchísimo dejando una reseña en Google.',
  cobro:
    '¡Hola {nombre}! Aquí está el enlace para tu pago de {servicio} (${monto}): {enlace}',
}

/** Reemplaza {nombre}, {servicio}, {fecha}, {hora}, {enlace} y {monto} en una plantilla. */
export function aplicarPlantilla(
  contenido: string,
  datos: {
    nombre: string
    servicio: string
    fecha: string
    hora: string
    enlace?: string
    monto?: string
  }
) {
  return contenido
    .replaceAll('{nombre}', datos.nombre)
    .replaceAll('{servicio}', datos.servicio)
    .replaceAll('{fecha}', datos.fecha)
    .replaceAll('{hora}', datos.hora)
    .replaceAll('{enlace}', datos.enlace ?? '')
    .replaceAll('{monto}', datos.monto ?? '')
}

/** Llama a la Edge Function que crea el link de pago con Wompi. */
export async function generarEnlacePago(appointmentId: string) {
  const { data, error } = await supabase.functions.invoke<{
    enlace_pago?: string
    error?: string
  }>('crear-link-pago-wompi', {
    body: { appointment_id: appointmentId },
  })

  if (error) {
    // El SDK no mete el cuerpo de la respuesta en `error.message` cuando el
    // status no es 2xx — hay que leerlo aparte desde error.context.
    let mensaje = error.message
    try {
      const cuerpo = await error.context?.json()
      if (cuerpo?.error) mensaje = cuerpo.error
    } catch {
      // sin cuerpo legible, nos quedamos con el mensaje genérico
    }
    throw new Error(mensaje)
  }

  if (!data?.enlace_pago) {
    throw new Error('No se pudo generar el enlace de pago.')
  }
  return data.enlace_pago
}

/** Llama a la Edge Function que crea el enlace de pago de la suscripción Pro. */
export async function generarEnlaceSuscripcion() {
  const { data, error } = await supabase.functions.invoke<{
    enlace_pago?: string
    error?: string
  }>('crear-link-suscripcion-wompi')

  if (error) {
    let mensaje = error.message
    try {
      const cuerpo = await error.context?.json()
      if (cuerpo?.error) mensaje = cuerpo.error
    } catch {
      // sin cuerpo legible, nos quedamos con el mensaje genérico
    }
    throw new Error(mensaje)
  }

  if (!data?.enlace_pago) {
    throw new Error('No se pudo generar el enlace de pago.')
  }
  return data.enlace_pago
}
