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
          ? "border-emerald-500/50 bg-gradient-to-br from-slate-800 to-slate-900"
          : "border-slate-700 bg-slate-800"
      } hover:border-emerald-500/80 hover:shadow-lg hover:shadow-emerald-500/10 group`}
    >
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">Destaque</Badge>
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-slate-900/80 backdrop-blur text-white border border-slate-700">{category}</Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-emerald-500/90 px-2 py-1 rounded text-sm text-white">
              <TrendingUp size={14} />
              <span className="font-semibold">{returnRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">{title}</h3>
        <p className="text-slate-400 mb-4 text-sm line-clamp-2">{description}</p>

        <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Retorno Anual</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{returnRate}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Mínimo</p>
            <p className="text-sm font-semibold text-slate-200 mt-1">Kz {minInvestment.toLocaleString("pt-PT")}</p>
          </div>
        </div>

        {progress !== null && (
          <div className="mb-5">
            <div className="flex justify-between mb-2 text-xs">
              <span className="text-slate-400">Progresso</span>
              <span className="text-emerald-400 font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Kz {(totalFunding! - remaining!).toLocaleString("pt-PT")} investido</span>
              <span>Kz {remaining!.toLocaleString("pt-PT")} restante</span>
            </div>
          </div>
        )}

        <Button
          asChild
          variant="outline"
          className="w-full"
        >
          <Link to={`/investments/${id}`}>Investir Agora</Link>
        </Button>
      </div>
    </motion.div>
  )
}

export default InvestmentCard
