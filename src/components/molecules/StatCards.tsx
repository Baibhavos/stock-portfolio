'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
type Props = { totalInvestment: number; totalPresentValue: number; totalPnL: number };
export function StatCards({ totalInvestment, totalPresentValue, totalPnL }: Props) {
  const pnlClass = totalPnL >= 0 ? 'text-green-400' : 'text-red-400';
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Investment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">₹{totalInvestment.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Present Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">₹{totalPresentValue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card className='col-span-2'>
        <CardHeader>
          <CardTitle className="text-lg">Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl ${pnlClass}`}>₹{totalPnL.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
