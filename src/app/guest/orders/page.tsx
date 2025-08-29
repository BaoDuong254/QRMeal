import OrdersCart from "@/app/guest/orders/OrdersCart";

export default function OrdersPage() {
  return (
    <div className='mx-auto max-w-[400px] space-y-4'>
      <h1 className='text-center text-xl font-bold'>Đơn hàng</h1>
      <OrdersCart />
    </div>
  );
}
