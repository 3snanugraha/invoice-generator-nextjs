// import Image from "next/image";

interface InvoiceTemplateProps {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  bookings: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  paymentDate: string;
  paidAmount: number;
}

export default function InvoiceTemplate({
  customerName,
  invoiceNumber,
  invoiceDate,
  bookings,
  paymentDate,
  paidAmount
}: InvoiceTemplateProps) {
  const calculateTotal = () => bookings.reduce((sum, booking) => sum + booking.amount, 0);
  
  return (
    <div className="bg-white w-[210mm] h-[297mm] relative">
      <div className="absolute inset-0 m-8 border border-gray-300 p-8 text-black">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">INVOICE</h1>
          </div>

          {/* Company Info & Logo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="self-start">
              <h2 className="font-bold">NUSA INDAH PANJALU HOTEL</h2>
              <p className="text-sm">
                Jln. Pasanggrahan No 59 Panjalu<br />
                Ciamis<br />
                Indonesia<br />
                Mobile: 081297742115<br />
                Email: nusaindahpanjalu@gmail.com
              </p>
            </div>
            <div className="flex justify-end">
              <img 
                src="/logo.png" 
                alt="NUSA INDAH PANJALU logo" 
                width={96}  // 24 * 4 (96px)
                height={96} // 24 * 4 (96px)
                style={{
                  objectFit: 'contain',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </div>
          </div>

          <div className="border-t border-b border-gray-300 my-4" />

          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="font-bold">Bill To</p>
              <p>{customerName}</p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p className="font-bold">Invoice No</p>
                <p>Invoice Date</p>
              </div>
              <div>
                <p className="font-bold text-right">{invoiceNumber}</p>
                <p className="text-right">{new Date(invoiceDate).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="border border-gray-300 p-2 w-16 text-center">Sl.</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2 w-20 text-center">Qty</th>
                  <th className="border border-gray-300 p-2 w-32 text-right">Rate</th>
                  <th className="border border-gray-300 p-2 w-32 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{booking.description}</td>
                    <td className="border border-gray-300 p-2 text-center">{booking.quantity}</td>
                    <td className="border border-gray-300 p-2 text-right">
                      Rp {booking.rate.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      Rp {booking.amount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div>
            <div className="ml-auto w-1/2">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <p className="text-right font-bold">Subtotal:</p>
                <p className="text-right font-bold">
                  Rp {calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                </p>
                <div className="col-span-2 border-t border-gray-300 my-1"></div>
                <p className="text-right font-bold">Total:</p>
                <p className="text-right font-bold">
                  Rp {calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-right">
                  Paid ({new Date(paymentDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}):
                </p>
                <p className="text-right">
                  Rp {paidAmount.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-right font-bold">Balance Due:</p>
                <p className="text-right font-bold">
                  Rp {(calculateTotal() - paidAmount).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                </p>
                <div className="col-span-2 border-b border-gray-300 my-1"></div>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-end mt-2 mr-24">
            <img 
              src="/signature.png" 
              alt="Signature" 
              width={128} // 32 * 4 (128px)
              height={64} // 16 * 4 (64px)
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
            <p className="mt-2">Muhamad Kobul</p>
          </div>
        </div>
      </div>
    </div>
  );
}
