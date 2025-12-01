"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { TrendingUp } from "lucide-react"

interface InvestmentCardProps {
  id: string
  title: string
  description: string
  category: string
  returnRate: number
  minInvestment: number
  image: string
  delay?: number
  featured?: boolean
  remaining?: number
  totalFunding?: number
  tipoRenda?: string
}

const InvestmentCard = ({
  id,
  title,
  description,
  category,
  returnRate,
  minInvestment,
  image,
  delay = 0,
  featured = false,
  remaining,
  totalFunding,
  tipoRenda = "fixa",
}: InvestmentCardProps) => {
  const progress = remaining && totalFunding ? ((totalFunding - remaining) / totalFunding) * 100 : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
        featured
          ? "border-slate-700 bg-slate-900"
          : "border-slate-700 bg-slate-900"
      } hover:border-primary/80 hover:shadow-lg hover:shadow-primary/10 group`}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-primary text-white">Destaque</Badge>
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent"></div>

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-slate-600 backdrop-blur text-white border border-slate-700">{category}</Badge>
          <Badge className="bg-blue-600 backdrop-blur text-white border border-blue-700">
            {tipoRenda === 'fixa' ? 'Renda Fixa' : tipoRenda === 'variavel' ? 'Renda Variável' : 'Renda Passiva'}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-primary/90 px-2 py-1 rounded text-sm text-white">
              <TrendingUp size={14} />
              <span className="font-semibold">{returnRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">{title}</h3>
        <p className="text-slate-400 mb-4 text-sm line-clamp-2">{description}</p>

        <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-800">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Retorno Anual</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{returnRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Mínimo</p>
            <p className="text-sm font-semibold text-white mt-1">Kz {minInvestment.toLocaleString("pt-PT")}</p>
          </div>
        </div>

        {progress !== null && (
          <div className="mb-5">
            <div className="flex justify-between mb-2 text-xs">
              <span className="text-slate-400">Progresso</span>
              <span className="text-emerald-400 font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Kz {(totalFunding! - remaining!).toLocaleString("pt-PT")} investido</span>
              <span>Kz {remaining!.toLocaleString("pt-PT")} restante</span>
            </div>
          </div>
        )}

        <Button
          asChild
          className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold"
        >
          <Link to={`/investments/${id}`}>Investir Agora</Link>
        </Button>
      </div>
    </motion.div>
  )
}

export default InvestmentCard
