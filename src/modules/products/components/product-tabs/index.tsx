"use client"

import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import './style.css';
type ProductTabsProps = {
  product: PricedProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs =  [
    {
      label: "معلومات عن المنتج",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "التوصيل والإسترجاع",
      component: <ShippingInfoTab  />,
    }
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={['0','1']}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={i?.toString()}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}


const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-blue-500">مصنوع من</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-500">البلد المصنع</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-500">النوع</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-blue-500">الوزن</span>
            <p>{product.weight ? `${product.weight} غ` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-blue-500">القياسات</span>
            <p >
              {product.length && product.width && product.height
                ? `الطول${ product.length} x العرض${product.width} x الإرتفاع${product.height}`
                :  product.length && product.width ?
                 `الطول${product.length} x العرض${product.width} `
                : "-"}
            </p>
          </div>
        </div>
      </div>
      {product.tags?.length ? (
        <div>
          <span className="font-semibold">Tags</span>
        </div>
      ) : null}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold text-blue-500">توصيل سريع</span>
            <p className="max-w-sm">
            سيصل طردك من يوم واحد إلى 3 أيام إلى مكتب شركة التوصيل أو إلى منزلك.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold text-blue-500">تبادلات بسيطة</span>
            <p className="max-w-sm">
            هل المقياس ليس مناسبًا تمامًا؟ لا تقلق - سنقوم بتبديل منتجك بواحد جديد
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold text-blue-500">إسترجاع سهل</span>
            <p className="max-w-sm">
            قم بإرجاع منتجك فقط وسنقوم بإعادة مبلغك. بدون أي أسئلة - سنبذل قصارى جهدنا لضمان عملية الإرجاع بدون عناء.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


export default ProductTabs
