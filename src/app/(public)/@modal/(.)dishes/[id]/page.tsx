import dishApiRequest from "@/apiRequests/dish";
import Modal from "@/app/(public)/@modal/(.)dishes/[id]/Modal";
import DishDetail from "@/app/(public)/dishes/[id]/DishDetail";
import { wrapServerApi } from "@/lib/utils";

export default async function DishPage(props: { params: { id: string } }) {
  const { id } = await props.params;
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));

  const dish = data?.payload?.data;
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
