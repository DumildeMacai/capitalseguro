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
      administradores: {
        Row: {
          data_criacao: string | null
          email: string
          id: string
          nivel_acesso: string | null
          nome_completo: string
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          data_criacao?: string | null
          email: string
          id?: string
          nivel_acesso?: string | null
          nome_completo: string
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          data_criacao?: string | null
          email?: string
          id?: string
          nivel_acesso?: string | null
          nome_completo?: string
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aplicacoes: {
        Row: {
          data_investimento: string | null
          data_resgate: string | null
          id: string
          investimento_id: string | null
          user_id: string | null
          valor_investido: number
        }
        Insert: {
          data_investimento?: string | null
          data_resgate?: string | null
          id?: string
          investimento_id?: string | null
          user_id?: string | null
          valor_investido: number
        }
        Update: {
          data_investimento?: string | null
          data_resgate?: string | null
          id?: string
          investimento_id?: string | null
          user_id?: string | null
          valor_investido?: number
        }
        Relationships: [
          {
            foreignKeyName: "aplicacoes_investimento_id_fkey"
            columns: ["investimento_id"]
            isOneToOne: false
            referencedRelation: "investimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      investidores: {
        Row: {
          data_criacao: string | null
          documento_frente: string | null
          documento_verso: string | null
          id: string
          idade: number | null
          morada: string | null
          nome_completo: string
          user_id: string | null
        }
        Insert: {
          data_criacao?: string | null
          documento_frente?: string | null
          documento_verso?: string | null
          id?: string
          idade?: number | null
          morada?: string | null
          nome_completo: string
          user_id?: string | null
        }
        Update: {
          data_criacao?: string | null
          documento_frente?: string | null
          documento_verso?: string | null
          id?: string
          idade?: number | null
          morada?: string | null
          nome_completo?: string
          user_id?: string | null
        }
        Relationships: []
      }
      investimentos: {
        Row: {
          descricao: string | null
          id: string
          imagem: string | null
          nome_investimento: string
          rentabilidade: number | null
          tipo: string | null
          valor_minimo: number | null
        }
        Insert: {
          descricao?: string | null
          id?: string
          imagem?: string | null
          nome_investimento: string
          rentabilidade?: number | null
          tipo?: string | null
          valor_minimo?: number | null
        }
        Update: {
          descricao?: string | null
          id?: string
          imagem?: string | null
          nome_investimento?: string
          rentabilidade?: number | null
          tipo?: string | null
          valor_minimo?: number | null
        }
        Relationships: []
      }
      parceiros: {
        Row: {
          data_criacao: string | null
          documento_frente: string | null
          documento_verso: string | null
          id: string
          idade: number | null
          morada: string | null
          nome_completo: string
          ramo_negocio: string | null
          trabalho: string | null
          user_id: string | null
        }
        Insert: {
          data_criacao?: string | null
          documento_frente?: string | null
          documento_verso?: string | null
          id?: string
          idade?: number | null
          morada?: string | null
          nome_completo: string
          ramo_negocio?: string | null
          trabalho?: string | null
          user_id?: string | null
        }
        Update: {
          data_criacao?: string | null
          documento_frente?: string | null
          documento_verso?: string | null
          id?: string
          idade?: number | null
          morada?: string | null
          nome_completo?: string
          ramo_negocio?: string | null
          trabalho?: string | null
          user_id?: string | null
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
