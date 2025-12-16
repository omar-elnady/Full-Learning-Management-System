"use client";

import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useGetTransactionsQuery } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import Header from "@/components/Header";
const UserBillingPage = () => {
  const [paymentType, setPaymentType] = useState("all");
  const { user, isLoaded } = useUser();
  const { data: transactions, isLoading: isLoadingTransactions } =
    useGetTransactionsQuery(user?.id || "", {
      skip: !isLoaded || !user,
    });

  const filterData =
    transactions?.filter((transaction) => {
      const matchesTypes =
        paymentType === "all" || transaction.paymentProvider === paymentType;
      return matchesTypes;
    }) || [];

  if (!isLoaded) return <Loading />;
  if (!user)
    return <div className="p-4">Please sign in to view your billing information.</div>;

  return (
    <div className="space-y-6 w-full mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Header title={`Payment History`} subtitle={`View your payment history`} />

        <div className="flex items-center gap-3">
          <Select value={paymentType} onValueChange={setPaymentType}>
            <SelectTrigger className="md:w-[160px] w-[200px] py-4">
              <SelectValue placeholder="Filter by provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paypal">Paypal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        {isLoadingTransactions ? (
          <div className="h-64 flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b bg-muted/50">
                  <TableHead className="w-[200px] h-12">Date</TableHead>
                  <TableHead className="h-12">Transaction ID</TableHead>
                  <TableHead className="w-[200px] h-12">Payment Method</TableHead>
                  <TableHead className="text-right w-[150px] h-12">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterData.length > 0 ? (
                  filterData.map((transaction) => (
                    <TableRow key={transaction.transactionId} className="group hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        {new Date(transaction.dateTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {transaction.transactionId.slice(0, 8).toUpperCase()}...
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${transaction.paymentProvider === 'stripe'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                          {transaction.paymentProvider}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-lg">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CreditCard className="w-8 h-8 opacity-40" />
                        <p>No transactions found for the selected filter.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {filterData.length > 0 && (
        <div className="text-xs text-muted-foreground text-center pt-4">
          Showing {filterData.length} transaction{filterData.length !== 1 && 's'}
        </div>
      )}
    </div>
  );
};

export default UserBillingPage;
