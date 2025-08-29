"use client";

import { Badge } from "@/components/ui/badge";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderListQuery } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery();
  const orders = data?.payload.data ?? [];
  const totalPrice = orders.reduce((result, order) => {
    return result + order.dishSnapshot.price * order.quantity;
  }, 0);
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Connected to server with ID:", socket.id);
    }

    function onDisconnect() {
      console.log("Disconnected from server");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      console.log("Order updated:", data);
      refetch();
    }

    socket.on("update-order", onUpdateOrder);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [refetch]);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className='flex gap-4'>
          <div className='text-xm font-semibold'>{index + 1}</div>
          <div className='relative flex-shrink-0'>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className='h-[80px] w-[80px] rounded-md object-cover'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <div className='text-xs font-semibold'>
              {formatCurrency(order.dishSnapshot.price)} x <Badge className='px-1'>{order.quantity}</Badge>
            </div>
          </div>
          <div className='ml-auto flex flex-shrink-0 items-center justify-center'>
            <Badge variant='outline'>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}
      <div className='sticky bottom-0'>
        <div className='flex w-full justify-between space-x-4 text-xl font-semibold'>
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
}
