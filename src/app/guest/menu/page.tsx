import MenuOrder from "@/app/guest/menu/MenuOrder";

export default async function MenuPage() {
  return (
    <div className='mx-auto max-w-[400px] space-y-4'>
      <h1 className='text-center text-xl font-bold'>🍕 Menu quán</h1>
      <MenuOrder />
    </div>
  );
}
