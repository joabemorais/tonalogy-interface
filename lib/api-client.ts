import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  ProgressionAnalysisRequest,
  ProgressionAnalysisResponse,
  APIError,
  Language
} from '@/types'

class TonalogyAPIClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'https://tonalogy-api.onrender.com'
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      // Headers mínimos para evitar CORS preflight
      headers: {
        'Accept': 'application/json'
      },
      withCredentials: false
    })

    // Request interceptor para configurar cada requisição
    this.client.interceptors.request.use(
      (config) => {
        // Configurar Content-Type apenas quando necessário
        if (config.data && typeof config.data === 'object') {
          config.headers['Content-Type'] = 'application/json'
        }
        
        // Garantir método POST para análises
        if (config.url?.includes('/analyze') || config.url?.includes('/visualize')) {
          config.method = 'POST'
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: APIError = {
          message: error.response?.data?.detail || error.message || 'Unknown error',
          status: error.response?.status || 500,
          details: error.response?.data
        }
        return Promise.reject(apiError)
      }
    )
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/')
      return true
    } catch {
      return false
    }
  }

  /**
   * Analyze a chord progression - calls API directly in production, proxy in development
   */
  async analyzeProgression(
    request: ProgressionAnalysisRequest,
    language?: Language
  ): Promise<ProgressionAnalysisResponse> {
    // Em desenvolvimento, usar o proxy do Next.js. Em produção, chamar a API diretamente
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment && typeof window !== 'undefined') {
      // Usar endpoint local do Next.js que faz proxy para o backend
      const url = new URL('/api/analyze', window.location.origin)
      if (language) {
        url.searchParams.set('lang', language)
      }
      
      // Debug: log do request
      console.log('📤 Sending request to:', url.toString())
      console.log('📦 Request data:', JSON.stringify(request, null, 2))
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
      
      console.log('📥 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log('❌ Error response:', errorData)
        const apiError: APIError = {
          message: errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          details: errorData
        }
        throw apiError
      }
      
      const result = await response.json()
      console.log('✅ Success response:', result)
      return result
    } else {
      // Em produção ou no servidor, fazer chamada direta para a API
      const url = `/analyze${language ? `?lang=${language}` : ''}`
      const response = await this.client.post<ProgressionAnalysisResponse>(url, request)
      return response.data
    }
  }

  /**
   * Generate visualization for a chord progression - calls API directly in production, proxy in development
   */
  async visualizeProgression(
    request: ProgressionAnalysisRequest,
    language?: Language
  ): Promise<Blob> {
    // Em desenvolvimento, usar o proxy do Next.js. Em produção, chamar a API diretamente
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment && typeof window !== 'undefined') {
      // Usar endpoint local do Next.js que faz proxy para o backend
      const url = new URL('/api/visualize', window.location.origin)
      if (language) {
        url.searchParams.set('lang', language)
      }
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        const apiError: APIError = {
          message: `Visualization failed: ${response.status} ${response.statusText}`,
          status: response.status,
          details: { error: errorText }
        }
        throw apiError
      }
      
      return response.blob()
    } else {
      // Em produção ou no servidor, fazer chamada direta para a API
      const url = `/visualize${language ? `?lang=${language}` : ''}`
      const response = await this.client.post(url, request, {
        responseType: 'blob'
      })
      return response.data
    }
  }

  /**
   * Get base URL for the API
   */
  getBaseURL(): string {
    return this.baseURL
  }

  /**
   * Update the base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url
    this.client.defaults.baseURL = url
  }
}

// Singleton instance
export const apiClient = new TonalogyAPIClient()

// Export the class for custom instances
export { TonalogyAPIClient }
