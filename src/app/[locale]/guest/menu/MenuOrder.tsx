"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishListQuery } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";
import Quantity from "@/app/[locale]/guest/menu/Quantity";

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const dishes = data?.payload.data ?? [];
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();
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
  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push(`/guest/orders`);
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn("flex gap-4", {
              "pointer-events-none": dish.status === DishStatus.Unavailable,
            })}
          >
            <div className='relative flex-shrink-0'>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 flex items-center justify-center text-sm'>Hết hàng</span>
              )}
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
        <Button className='w-full justify-between' onClick={handleOrder} disabled={orders.length === 0}>
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
