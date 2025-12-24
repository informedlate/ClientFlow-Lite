import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentReceiptProps {
    transactionId: string;
    amount: number;
    invoiceId: string;
    clientName: string;
    paymentDate: string;
    paymentMethod: string;
    description: string;
    onClose?: () => void;
    onDownload?: () => void;
}

export function PaymentReceipt({
    transactionId,
    amount,
    invoiceId,
    clientName,
    paymentDate,
    paymentMethod,
    description,
    onClose,
    onDownload,
}: PaymentReceiptProps) {
    return (
          <Card className="bg-slate-900 border-slate-700 p-8 max-w-2xl mx-auto">
            {/* Header */}
                <div className="border-b border-slate-700 pb-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                                  <div>
                                              <h1 className="text-3xl font-bold text-white">Payment Receipt</h1>h1>
                                              <p className="text-slate-400 text-sm mt-1">Transaction confirmed</p>p>
                                  </div>div>
                                  <div className="text-right">
                                              <div className="inline-block bg-green-900/20 border border-green-700 rounded-lg px-4 py-2">
                                                            <p className="text-green-400 font-semibold text-sm">✓ Payment Complete</p>p>
                                              </div>div>
                                  </div>div>
                        </div>div>
                </div>div>
          
            {/* Main Content */}
                <div className="space-y-6">
                  {/* Amount Display */}
                        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-700/50 rounded-lg p-6">
                                  <p className="text-slate-400 text-sm mb-2">Amount Paid</p>p>
                                  <p className="text-4xl font-bold text-indigo-400 mb-1">
                                    {formatCurrency(amount)}
                                  </p>p>
                                  <p className="text-slate-500 text-xs">USD • Paid in full</p>p>
                        </div>div>
                
                  {/* Transaction Details */}
                        <div className="grid grid-cols-2 gap-6">
                                  <div>
                                              <p className="text-slate-400 text-sm mb-2">Transaction ID</p>p>
                                              <p className="text-white font-mono text-sm bg-slate-800 p-3 rounded border border-slate-700">
                                                {transactionId}
                                              </p>p>
                                  </div>div>
                                  <div>
                                              <p className="text-slate-400 text-sm mb-2">Invoice ID</p>p>
                                              <p className="text-white font-mono text-sm bg-slate-800 p-3 rounded border border-slate-700">
                                                {invoiceId}
                                              </p>p>
                                  </div>div>
                        </div>div>
                
                  {/* Receipt Information */}
                        <div className="space-y-4 border-t border-slate-700 pt-6">
                                  <div className="flex justify-between items-center">
                                              <span className="text-slate-400">Client Name</span>span>
                                              <span className="text-white font-medium">{clientName}</span>span>
                                  </div>div>
                                  <div className="flex justify-between items-center">
                                              <span className="text-slate-400">Payment Date</span>span>
                                              <span className="text-white font-medium">{formatDate(paymentDate)}</span>span>
                                  </div>div>
                                  <div className="flex justify-between items-center">
                                              <span className="text-slate-400">Payment Method</span>span>
                                              <span className="text-white font-medium">{paymentMethod}</span>span>
                                  </div>div>
                                  <div className="flex justify-between items-center">
                                              <span className="text-slate-400">Description</span>span>
                                              <span className="text-white font-medium">{description}</span>span>
                                  </div>div>
                        </div>div>
                
                  {/* Totals */}
                        <div className="space-y-2 border-t border-slate-700 pt-6">
                                  <div className="flex justify-between items-center">
                                              <span className="text-slate-400">Subtotal</span>span>
                                              <span className="text-white">{formatCurrency(amount)}</span>span>
                                  </div>div>
                                  <div className="flex justify-between items-center">
                                              <span className="text-slate-400">Processing Fee</span>span>
                                              <span className="text-white">$0.00</span>span>
                                  </div>div>
                                  <div className="flex justify-between items-center text-lg border-t border-slate-700 pt-4 mt-4">
                                              <span className="text-white font-semibold">Total Paid</span>span>
                                              <span className="text-indigo-400 font-bold">{formatCurrency(amount)}</span>span>
                                  </div>div>
                        </div>div>
                
                  {/* Notes */}
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                                  <p className="text-slate-300 text-sm">
                                              Thank you for your payment! A confirmation email will be sent to the registered email address.
                                              This receipt is for your records.
                                  </p>p>
                        </div>div>
                
                  {/* Actions */}
                        <div className="flex gap-3 pt-6 border-t border-slate-700">
                                  <Button
                                                onClick={onDownload}
                                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
                                              >
                                              Download Receipt
                                  </Button>Button>
                                  <Button
                                                onClick={onClose}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                              >
                                              Done
                                  </Button>Button>
                        </div>div>
                </div>div>
          
            {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                        <p className="text-slate-500 text-xs">
                                  ClientFlow Lite • Secured Payment Processing • PCI DSS Compliant
                        </p>p>
                </div>div>
          </Card>Card>
        );
}</Card>
