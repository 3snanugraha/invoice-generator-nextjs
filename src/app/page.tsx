'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import InvoiceTemplate from '@/components/invoice-template';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';

interface RoomBooking {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function Home() {
  const [customerName, setCustomerName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [paymentDate, setPaymentDate] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const generatePDF = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.minHeight = '297mm';
    document.body.appendChild(tempDiv);
  
    const root = ReactDOM.createRoot(tempDiv);
    root.render(
      <InvoiceTemplate
        customerName={customerName}
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        bookings={bookings}
        paymentDate={paymentDate}
        paidAmount={paidAmount}
      />
    );
  
    await new Promise(resolve => setTimeout(resolve, 100));
  
    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        logging: false,
        useCORS: true,
        imageTimeout: 0,
        width: 793, // 210mm in pixels
        height: 1122 // 297mm in pixels
      });
  
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });
  
      doc.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        0,
        0,
        210,
        297,
        undefined,
        'FAST'
      );
      
      doc.save(`Invoice-${invoiceNumber || 'untitled'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(tempDiv);
    }
  };  
  
  const addBooking = () => {
    setBookings([...bookings, {
      description: '',
      quantity: 1,
      rate: 350000,
      amount: 350000
    }]);
  };

  const calculateTotal = () => {
    return bookings.reduce((sum, booking) => sum + booking.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <Image src="/logo.png" alt="Logo" width={100} height={100} className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Generator Faktur</h1>
          <p className="text-gray-600">NUSA INDAH PANJALU HOTEL</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Customer Info Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nama Pelanggan</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-black placeholder-gray-400"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama pelanggan"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nomor Faktur</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-black placeholder-gray-400"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="FAK-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Tanggal Faktur</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-black"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
          </div>

          {/* Bookings Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Pemesanan Kamar</h2>
              <button
                onClick={addBooking}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Kamar
              </button>
            </div>

            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Deskripsi Kamar"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-400"
                      value={booking.description}
                      onChange={(e) => {
                        const newBookings = [...bookings];
                        newBookings[index].description = e.target.value;
                        setBookings(newBookings);
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Jumlah"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-400"
                      value={booking.quantity}
                      onChange={(e) => {
                        const newBookings = [...bookings];
                        newBookings[index].quantity = parseInt(e.target.value);
                        newBookings[index].amount = newBookings[index].quantity * newBookings[index].rate;
                        setBookings(newBookings);
                      }}
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        placeholder="Harga"
                        className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-400"
                        value={booking.rate}
                        onChange={(e) => {
                          const newBookings = [...bookings];
                          newBookings[index].rate = parseInt(e.target.value);
                          newBookings[index].amount = newBookings[index].quantity * newBookings[index].rate;
                          setBookings(newBookings);
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Rp {booking.amount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <button
                        onClick={() => {
                          const newBookings = bookings.filter((_, i) => i !== index);
                          setBookings(newBookings);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Tanggal Pembayaran</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-black"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Jumlah Dibayar</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                <input
                  type="number"
                  className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black placeholder-gray-400"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="border-t pt-6">
            <div className="max-w-sm ml-auto">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>Rp {calculateTotal().toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Jumlah Dibayar:</span>
                  <span>Rp {paidAmount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                  <span>Sisa Pembayaran:</span>
                  <span>Rp {(calculateTotal() - paidAmount).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={generatePDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Buat Faktur
            </button>
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Pratinjau
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-8">
          <div className="bg-white rounded-lg w-[95vw] h-[90vh] md:w-auto md:h-auto relative overflow-hidden">
            <button 
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full overflow-auto flex items-start justify-center p-8">
              <div 
                ref={invoiceRef} 
                className="w-[210mm] min-h-[297mm] transform-gpu origin-top mt-8"
                style={{
                  transform: `scale(${Math.min(
                    (window.innerWidth * 0.95 - 64) / 793, 
                    (window.innerHeight * 0.90 - 96) / 1122
                  )})`
                }}
              >
                <InvoiceTemplate
                  customerName={customerName}
                  invoiceNumber={invoiceNumber}
                  invoiceDate={invoiceDate}
                  bookings={bookings}
                  paymentDate={paymentDate}
                  paidAmount={paidAmount}
                />
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
