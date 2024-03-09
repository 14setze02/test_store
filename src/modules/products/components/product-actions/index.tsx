"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button, Input, Label, Toast } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import wilaya from "../assets/wilaya.json";
import communes from "../assets/communes.json";

import { useIntersection } from "@lib/hooks/use-in-view"
import { addToCart } from "@modules/cart/actions"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"

import MobileActions from "../mobile-actions"
import ProductPrice from "../product-price"
import NativeSelect from "@modules/common/components/native-select"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

export default function ProductActions({
  product,
  region,
}: ProductActionsProps) {
  
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<number>(0);
  const [qte, setQte] = useState<number>(1);
  const [wilay, setWilay] = useState<string>('1');
  const [wilaia, setWilaya] = useState<string>('1');
  const [commune, setCommune] = useState<string>('');
  const [postal_code, setPostalCode] = useState<string>('');
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  const countryCode = useParams().countryCode as string

  const variants = product.variants

  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }

    setOptions(optionObj)
  }, [product])

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue

      const temp: Record<string, string> = {}

      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (variant && !variant.inventory_quantity) {
      return false
    }

    if (variant && variant.allow_backorder === false) {
      return true
    }
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: variant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
      <Label>الإسم</Label>
          <Input
            name="nom"
            autoComplete="family-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required

          />
          <Label>رقم الهاتف</Label>
          <Input
            name="phone"
            autoComplete="phone-number"
            value={phone}
            onChange={(e) => {
              if (e.target.value.length > 1 && !['05', '06', '07'].includes(e.target.value.slice(0, 2))) {
                Toast({
                  variant: 'error',
                  title: "خلل",
                  description: "يرجى كتابة رقم هاتف صحيح"
                })
              }
              else if (e.target.value?.length > 10) {
                Toast({
                  variant: 'error',
                  title: "خلل",
                  description: "رقم الهاتف لا يتجاوز 10 أرقام"
                })
              }
              else setPhone(parseInt(e.target.value))
            }}
            type="number"
            required
          />
          <Label>الولاية</Label>
          <NativeSelect placeholder={"الولاية"} defaultValue={''} onChange={(e) => { setWilay(e.target.value); setWilaya(e.target.selectedOptions[0].label) }}  >
            {wilaya.map(({ id, ar_name }, index) => (
              <option key={id} value={id}>
                {ar_name}
              </option>
            ))}
          </NativeSelect>
          <Label>البلدية</Label>
          <NativeSelect placeholder={"البلدية"} defaultValue={''} onChange={(e) => { setCommune(e.target.selectedOptions[0].label); setPostalCode(e.target.value) }}  >
            {communes.filter((val) => val.wilaya_id == wilay).map(({ id, ar_name, post_code }, index) => (
              <option key={id} value={post_code}>
                {ar_name}
              </option>
            ))}
          </NativeSelect>
          <Label>الكمية</Label>
          <Input
            name="qte"
            autoComplete="phone-number"
            value={qte}
            onChange={(e) => {
              setQte(parseInt(e.target.value))
            }}
            type="number"
            required
          />

        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={variant} region={region} />

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !variant}
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
        >
          {!variant
            ? "Select variant"
            : !inStock
            ? "Out of stock"
            : "Add to cart"}
        </Button>
        <MobileActions
          product={product}
          variant={variant}
          region={region}
          options={options}
          updateOptions={updateOptions}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
        />
      </div>
    </>
  )
}
