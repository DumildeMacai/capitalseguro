import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const ReturnCalculator = () => {
  const [investment, setInvestment] = useState(10000);
  const [years, setYears] = useState(1);
  const annualReturnRate = 50; // 50% annual return

  const calculateReturn = (principal: number, rate: number, time: number) => {
    // Calculate compound interest over time
    const finalAmount = principal * Math.pow(1 + rate / 100, time);
    return finalAmount;
  };

  const estimatedReturn = calculateReturn(investment, annualReturnRate, years);
  const totalProfit = estimatedReturn - investment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden border border-border shadow-lg card-shadow"
    >
      <div className="bg-gradient-primary text-white p-6">
        <h3 className="text-2xl font-bold mb-2">Investment Return Calculator</h3>
        <p className="opacity-90">
          See how your money grows with our 50% annual returns. Principal available after 1 year.
        </p>
      </div>

      <div className="p-6 bg-card">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="investment-amount">Investment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="investment-amount"
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="pl-7 w-32"
                  min={1000}
                  max={1000000}
                />
              </div>
            </div>
            <Slider
              value={[investment]}
              min={1000}
              max={100000}
              step={1000}
              onValueChange={(value) => setInvestment(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="investment-time">Investment Period</Label>
              <div className="flex items-center">
                <Input
                  id="investment-time"
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-20 mr-2"
                  min={1}
                  max={10}
                />
                <span className="text-muted-foreground">Years</span>
              </div>
            </div>
            <Slider
              value={[years]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setYears(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 Year</span>
              <span>10 Years</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Initial Investment</p>
              <p className="text-2xl font-bold">Kz {investment.toLocaleString('pt-PT')}</p>
            </Card>
            <Card className="p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Total Return</p>
              <p className="text-2xl font-bold">Kz {Math.round(estimatedReturn).toLocaleString('pt-PT')}</p>
            </Card>
            <Card className="p-4 bg-success/10">
              <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
              <p className="text-2xl font-bold text-success">+Kz {Math.round(totalProfit).toLocaleString('pt-PT')}</p>
            </Card>
          </div>

          <Button asChild className="w-full bg-gradient-primary hover:opacity-90">
            <Link to="/login?register=true">Start Investing</Link>
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Investments have a 1-year lock period. Annual returns of 50% are calculated at the end of each year.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReturnCalculator;
