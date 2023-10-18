import { Product } from "@/type";
import OfferDetails from "./OfferDetails";
import ProductDescripiton from "./ProductDescripiton";
import ProductVideo from "./ProductVideo";

type ProductInfoProps = {
  product: Product;
};

function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col space-y-5">
      <ProductDescripiton product={product} />
      <ProductVideo source={product.video} />
      <OfferDetails product={product} />
    </div>
  );
}

export default ProductInfo;
