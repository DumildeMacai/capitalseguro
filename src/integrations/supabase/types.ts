export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      inscricoes_investimentos: {
        Row: {
          data_inicio: string | null
          id: string
          investimento_id: string
          retorno_esperado: number
          status: string | null
          usuario_id: string
          valor_investido: number
        }
        Insert: {
          data_inicio?: string | null
          id?: string
          investimento_id: string
          retorno_esperado: number
          status?: string | null
          usuario_id: string
          valor_investido: number
        }
        Update: {
          data_inicio?: string | null
          id?: string
          investimento_id?: string
          retorno_esperado?: number
          status?: string | null
          usuario_id?: string
          valor_investido?: number
        }
        Relationships: [
          {
            foreignKeyName: "inscricoes_investimentos_investimento_id_fkey"
            columns: ["investimento_id"]
            isOneToOne: false
            referencedRelation: "investimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscricoes_investimentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investimentos: {
        Row: {
          categoria: string
          data_criacao: string | null
          descricao: string
          id: string
          imagem_url: string | null
          parceiro_id: string | null
          prazo_minimo: number
          retorno_estimado: number
          status: string | null
          titulo: string
          valor_minimo: number
        }
        Insert: {
          categoria: string
          data_criacao?: string | null
          descricao: string
          id?: string
          imagem_url?: string | null
          parceiro_id?: string | null
          prazo_minimo: number
          retorno_estimado: number
          status?: string | null
          titulo: string
          valor_minimo: number
        }
        Update: {
          categoria?: string
          data_criacao?: string | null
          descricao?: string
          id?: string
          imagem_url?: string | null
          parceiro_id?: string | null
          prazo_minimo?: number
          retorno_estimado?: number
          status?: string | null
          titulo?: string
          valor_minimo?: number
        }
        Relationships: [
          {
            foreignKeyName: "investimentos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          data_cadastro: string | null
          documento_identidade_frente: string | null
          documento_identidade_verso: string | null
          email: string | null
          empresa_nome: string | null
          id: string
          nome_completo: string | null
          ramo_negocio: string | null
          status_verificacao: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          data_cadastro?: string | null
          documento_identidade_frente?: string | null
          documento_identidade_verso?: string | null
          email?: string | null
          empresa_nome?: string | null
          id: string
          nome_completo?: string | null
          ramo_negocio?: string | null
          status_verificacao?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          data_cadastro?: string | null
          documento_identidade_frente?: string | null
          documento_identidade_verso?: string | null
          email?: string | null
          empresa_nome?: string | null
          id?: string
          nome_completo?: string | null
          ramo_negocio?: string | null
          status_verificacao?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: "admin" | "parceiro" | "investidor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["admin", "parceiro", "investidor"],
    },
  },
} as const
