"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishListQuery } from "@/queries/useDish";
import { formatCurrency } from "@/lib/utils";
import Quantity from "@/app/guest/menu/Quantity";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const dishes = data?.payload.data ?? [];
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const totalPrice = dishes.reduce((result, dish) => {
    const order = orders.find((order) => order.dishId === dish.id);
    if (order) {
      return result + dish.price * order.quantity;
    }
    return result;
  }, 0);
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index].quantity = quantity;
      return newOrders;
    });
  };
  return (
    <>
      {dishes.map((dish) => (
        <div key={dish.id} className='flex gap-4'>
          <div className='flex-shrink-0'>
            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className='h-[80px] w-[80px] rounded-md object-cover'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{dish.name}</h3>
            <p className='text-xs'>{dish.description}</p>
            <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
          </div>
          <div className='ml-auto flex flex-shrink-0 items-center justify-center'>
            <Quantity
              onChange={(value) => handleQuantityChange(dish.id, value)}
              value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
            />
          </div>
        </div>
      ))}
      <div className='sticky bottom-0'>
        <Button className='w-full justify-between'>
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
