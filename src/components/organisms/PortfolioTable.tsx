'use client';
import * as React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Row as RowType } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/molecules/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function formatPct(n: number) {
  return (n * 100).toFixed(2) + '%';
}

export function PortfolioTable({ rows }: { rows: RowType[] }) {
  const columns = React.useMemo<ColumnDef<RowType>[]>(() => [
    {
      header: 'Particulars',
      accessorKey: 'name'
    },
    {
      header: 'Purchase Price',
      accessorKey: 'purchasePrice', cell: info => <>₹{Number(info.getValue()).toFixed(2)}</>
    },
    {
      header: 'Qty',
      accessorKey: 'quantity'
    },
    {
      header: 'Investment',
      accessorKey: 'investment',
      cell: info => <>₹{Number(info.getValue()).toFixed(2)}</>
    },
    {
      header: 'Portfolio (%)',
      accessorKey: 'portfolioWeight',
      cell: info => <>{formatPct(Number(info.getValue()))}</>
    },
    {
      header: 'NSE/BSE',
      accessorKey: 'exchange'
    },
    {
      header: 'CMP',
      accessorKey: 'cmp',
      cell: info => {
        const v = info.getValue() as number | undefined;
        return v != null ? <> ₹{v.toFixed(2)}</> : <>—</>;
      }
    },
    {
      header: 'Present Value',
      accessorKey: 'presentValue',
      cell: info => {
        const v = info.getValue() as number | undefined;
        return v != null ? <>₹{v.toFixed(2)}</> : <>—</>;
      }
    },
    {
      header: 'Gain/Loss',
      accessorKey: 'gainLoss',
      cell: info => {
        const v = Number(info.getValue()); const cls = v >= 0 ? 'text-green-400' : 'text-red-400';
        return <span className={cls}>₹{v.toFixed(2)}</span>;
      }
    },
    {
      header: 'P/E Ratio',
      accessorKey: 'pe',
      cell: info => {
        const v = info.getValue() as number | null | undefined;
        return v != null ? <>{v.toFixed(2)}</> : <>—</>;
      }
    },
    {
      header: 'Latest Earnings',
      accessorKey: 'latestEarnings',
      cell: info => (info.getValue() as string | null) ?? '—'
    },
  ], []);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  }
  );
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[46vh] overflow-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="sticky top-0 bg-black z-10">
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                  {hg.headers.map(h => (
                    <TableHead key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(r => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map(c => (
                    <TableCell key={c.id}>
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

  );
}
