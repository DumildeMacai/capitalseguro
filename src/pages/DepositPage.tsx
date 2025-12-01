"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import DepositForm from "@/components/DepositForm"
import { ArrowLeft } from "lucide-react"

const DepositPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/investidor")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex justify-center">
          <DepositForm />
        </div>
      </div>
    </div>
  )
}

export default DepositPage
