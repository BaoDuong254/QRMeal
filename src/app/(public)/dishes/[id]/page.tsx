import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";

export default async function DishDetail({ params: { id } }: { params: { id: string } }) {
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));

  const dish = data?.payload?.data;
  if (!dish)
    return (
      <div>
        <h1 className='text-2xl font-semibold lg:text-3xl'>Món ăn không tồn tại</h1>
      </div>
    );
  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold lg:text-3xl'>{dish.name}</h1>
      <div className='font-semibold'>Giá: {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        alt={dish.name}
        className='h-full max-h-[1080px] w-full max-w-[1080px] rounded-md object-cover'
        title={dish.name}
      />
      <p>{dish.description}</p>
    </div>
  );
}
