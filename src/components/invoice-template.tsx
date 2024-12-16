import Image from "next/image";

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
    <div id="invoice-container" className="bg-white p-8 max-w-4xl mx-auto">
      <div className="max-w-5xl mx-auto border border-gray-300 p-8 text-black">
        <h1 className="text-center text-2xl font-bold mb-1">INVOICE</h1>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold">NUSA INDAH PANJALU HOTEL</h2>
            <p>
              Jln. Pasanggrahan No 59 Panjalu<br />
              Ciamis<br />
              Indonesia<br />
              Mobile: 081297742115<br />
              Email: nusaindahpanjalu@gmail.com
            </p>
          </div>
          <div>
            <Image 
              src="/logo.png" 
              alt="NUSA INDAH PANJALU logo" 
              width={100}  
              height={100}
              className="w-24 h-auto mx-7 mt-12 mb-5"
            />
          </div>
        </div>


        <div className="border-t border-b border-gray-300 my-2">
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-bold">Bill To</p>
            <p>{customerName}</p>
          </div>
          <div>
            <p className="font-bold">Invoice No</p>
            <p>Invoice Date</p>
          </div>
          <div>
            <p className="font-bold">{invoiceNumber}</p>
            <p>{new Date(invoiceDate).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
            <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 p-2 text-center">Sl.</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2 text-center">Qty</th>
            <th className="border border-gray-300 p-2 text-right">Rate</th>
            <th className="border border-gray-300 p-2 text-right">Amount</th>
            </tr>
            </thead>
            <tbody>
            {bookings.map((booking, index) => (
            <tr key={index}>
            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
            <td className="border border-gray-300 p-2">{booking.description}</td>
            <td className="border border-gray-300 p-2 text-center">{booking.quantity}</td>
            <td className="border border-gray-300 p-2 text-right">Rp {booking.rate.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td className="border border-gray-300 p-2 text-right">Rp {booking.amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ))}
            </tbody>
        </table>


        <div className="flex justify-end mb-4">
          <div className="w-2/3">
            <div className="grid grid-cols-2">
              <p className="font-bold text-right">Subtotal</p>
              <p className="text-right font-bold">Rp {calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            <div className="grid grid-cols-2 border-t border-gray-300">
              <p className="font-bold text-right">Total</p>
              <p className="text-right font-bold">Rp {calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="grid grid-cols-2">
              <p className="text-right">Paid ({new Date(paymentDate).toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })})</p>
              <p className="text-right">Rp {paidAmount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="grid grid-cols-2 font-bold border-b border-gray-300 mt-2">
              <p className="text-right">Balance Due</p>
              <p className="text-right">Rp {(calculateTotal() - paidAmount).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end mb-4 mr-24">
          <Image 
            src="/signature.png" 
            alt="Signature" 
            width={100}
            height={50}
          />
          <p>Muhamad Kobul</p>
        </div>
        
      </div>
    </div>
  );
}