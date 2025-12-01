export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      deposits: {
        Row: {
          aprovado_por: string | null
          comprovante_url: string | null
          created_at: string | null
          data_aprovacao: string | null
          id: string
          metodo: string
          status: string | null
          usuario_id: string
          valor: number
        }
        Insert: {
          aprovado_por?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_aprovacao?: string | null
          id?: string
          metodo: string
          status?: string | null
          usuario_id: string
          valor: number
        }
        Update: {
          aprovado_por?: string | null
          comprovante_url?: string | null
          created_at?: string | null
          data_aprovacao?: string | null
          id?: string
          metodo?: string
          status?: string | null
          usuario_id?: string
          valor?: number
        }
        Relationships: []
      }
      inscricoes_investimentos: {
        Row: {
          data_aprovacao: string | null
          data_inscricao: string | null
          id: string
          investimento_id: string
          status: string | null
          usuario_id: string
          valor_investido: number
        }
        Insert: {
          data_aprovacao?: string | null
          data_inscricao?: string | null
          id?: string
          investimento_id: string
          status?: string | null
          usuario_id: string
          valor_investido: number
        }
        Update: {
          data_aprovacao?: string | null
          data_inscricao?: string | null
          id?: string
          investimento_id?: string
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
        ]
      }
      investimentos: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          colocacao: string | null
          criado_por: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          imagem: string | null
          prazo_minimo: number | null
          remaining: number | null
          retorno_estimado: number | null
          risco: string | null
          titulo: string
          total_funding: number | null
          valor_minimo: number | null
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          colocacao?: string | null
          criado_por?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          imagem?: string | null
          prazo_minimo?: number | null
          remaining?: number | null
          retorno_estimado?: number | null
          risco?: string | null
          titulo: string
          total_funding?: number | null
          valor_minimo?: number | null
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          colocacao?: string | null
          criado_por?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          imagem?: string | null
          prazo_minimo?: number | null
          remaining?: number | null
          retorno_estimado?: number | null
          risco?: string | null
          titulo?: string
          total_funding?: number | null
          valor_minimo?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cidade: string | null
          created_at: string | null
          data_nascimento: string | null
          documento_numero: string | null
          documento_tipo: string | null
          documento_url: string | null
          email: string | null
          empresa_nome: string | null
          endereco: string | null
          id: string
          is_admin: boolean | null
          nif: string | null
          nome_completo: string | null
          pais: string | null
          ramo_negocio: string | null
          saldo_disponivel: number | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cidade?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          documento_numero?: string | null
          documento_tipo?: string | null
          documento_url?: string | null
          email?: string | null
          empresa_nome?: string | null
          endereco?: string | null
          id: string
          is_admin?: boolean | null
          nif?: string | null
          nome_completo?: string | null
          pais?: string | null
          ramo_negocio?: string | null
          saldo_disponivel?: number | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cidade?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          documento_numero?: string | null
          documento_tipo?: string | null
          documento_url?: string | null
          email?: string | null
          empresa_nome?: string | null
          endereco?: string | null
          id?: string
          is_admin?: boolean | null
          nif?: string | null
          nome_completo?: string | null
          pais?: string | null
          ramo_negocio?: string | null
          saldo_disponivel?: number | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_type: { Args: { user_id: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
