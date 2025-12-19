"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import z from "zod";

import { cn } from "@/lib/utils";

import Image from "next/image";
import { Price, PriceValue } from "@/components/shadcnblocks/price";
import QuantityInput from "@/components/shadcnblocks/quantity-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/cart-context";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
}

type CartItem = {
  product_id: string;
  link: string;
  name: string;
  image: string;
  price: ProductPrice;
  quantity: number;
  details: {
    label: string;
    value: string;
  }[];
};

interface CartItemProps extends CartItem {
  index: number;
  onRemoveClick: () => void;
  onQuantityChange: (newQty: number) => void;
}

interface CartProps {
  cartItems: CartItem[];
  form: UseFormReturn<CheckoutFormType>;
}

const PAYMENT_METHODS = {
  creditCard: "creditCard",
  paypal: "paypal",
  onlineBankTransfer: "onlineBankTransfer",
};

type PaymentMethod = keyof typeof PAYMENT_METHODS;

const CreditCardPayment = z.object({
  method: z.literal(PAYMENT_METHODS.creditCard),
  cardholderName: z.string(),
  cardNumber: z.string(),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)")
    .refine((value) => {
      const [mm, yy] = value.split("/").map(Number);

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (yy < currentYear) return false;

      if (yy === currentYear && mm < currentMonth) return false;

      return true;
    }, "Card has expired"),
  cvc: z.string(),
});

const PayPalPayment = z.object({
  method: z.literal(PAYMENT_METHODS.paypal),
  payPalEmail: z.string(),
});

const BankTransferPayment = z.object({
  method: z.literal(PAYMENT_METHODS.onlineBankTransfer),
  bankName: z.string(),
  accountNumber: z.string(),
});

const PaymentSchema = z.discriminatedUnion("method", [
  CreditCardPayment,
  PayPalPayment,
  BankTransferPayment,
]);

const checkoutFormSchema = z.object({
  contactInfo: z.object({
    email: z.string(),
    subscribe: z.boolean().optional(),
  }),
  address: z.object({
    country: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    postalCode: z.string(),
    city: z.string(),
    phone: z.string(),
  }),
  shippingMethod: z.string(),
  payment: PaymentSchema,
  products: z
    .object({
      product_id: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
    .array(),
});

type CheckoutFormType = z.infer<typeof checkoutFormSchema>;

const CART_ITEMS: CartItem[] = [
  {
    product_id: "product-1",
    link: "#",
    name: "Stylish Maroon Sneaker",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/stylish-maroon-sneaker.png",
    price: {
      regular: 354.0,
      currency: "USD",
    },
    quantity: 1,
    details: [
      {
        label: "Color",
        value: "Red",
      },
      {
        label: "Size",
        value: "36",
      },
    ],
  },
  {
    product_id: "product-2",
    link: "#",
    name: "Bicolor Sweatshirt with Embroidered Logo",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/bicolor-crewneck-sweatshirt-with-embroidered-logo.png",
    price: {
      regular: 499.0,
      currency: "USD",
    },
    quantity: 1,
    details: [
      {
        label: "Color",
        value: "Blue & White",
      },
      {
        label: "Size",
        value: "L",
      },
    ],
  },
  {
    product_id: "product-4",
    link: "#",
    name: "Maroon Leather Handbag",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/maroon-leather-handbag.png",
    price: {
      regular: 245.0,
      currency: "USD",
    },
    quantity: 1,
    details: [
      {
        label: "Color",
        value: "Maroon",
      },
    ],
  },
];

interface Checkout1Props {
  cartItems?: CartItem[];
  className?: string;
  onSuccess?: () => void;
}

const Checkout1 = ({
  cartItems = CART_ITEMS,
  className,
  onSuccess,
}: Checkout1Props) => {
  const [activeAccordion, setActiveAccordion] = useState("item-1");
  const defaultProducts = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price.sale ?? item.price.regular,
  }));

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      payment: {
        method: PAYMENT_METHODS.creditCard,
      },
      products: defaultProducts,
    },
  });

  const onSubmit = (data: CheckoutFormType) => {
    console.log(data);
    if (onSuccess) {
      onSuccess();
    }
  };

  const onContinue = (value: string) => {
    setActiveAccordion(value);
  };

  const handleOnValueChange = (value: string) => {
    setActiveAccordion(value);
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2 mb-2">
              <Image
                src="/logo.png"
                alt="Universal AI Services"
                width={32}
                height={32}
                className="dark:invert"
              />
              <span className="text-lg font-semibold zalando-sans-expanded">
                Universal AI Services
              </span>
            </a>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Checkout
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                Complete your purchase securely
              </p>
            </div>
          </div>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-8">
              <div>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={activeAccordion}
                  onValueChange={handleOnValueChange}
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Contact Information
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <ContactFields />
                        <Button
                          type="button"
                          className="w-full"
                          variant="secondary"
                          onClick={() => onContinue("item-2")}
                        >
                          Continue
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Address
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <AddressFields />
                        <Button
                          type="button"
                          className="w-full"
                          variant="secondary"
                          onClick={() => onContinue("item-3")}
                        >
                          Continue
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Shipping Method
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <ShippingMethodFields />
                        <Button
                          type="button"
                          className="w-full"
                          variant="secondary"
                          onClick={() => onContinue("item-4")}
                        >
                          Continue
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="px-1 py-7 text-lg font-semibold hover:no-underline [&>svg:last-child]:hidden [&[data-state=closed]>svg:nth-of-type(2)]:hidden [&[data-state=open]>svg:nth-of-type(1)]:hidden [&[data-state=open]>svg:nth-of-type(2)]:block">
                      Payment
                      <Plus className="pointer-events-none size-4 shrink-0 self-center text-muted-foreground" />
                      <Minus className="pointer-events-none hidden size-4 shrink-0 self-center text-muted-foreground" />
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-7">
                      <div className="space-y-7">
                        <PaymentFields />
                        <Button type="submit" className="w-full">
                          Checkout
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div>
                <Cart form={form} cartItems={cartItems} />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

const ContactFields = () => {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-3.5">
      <Controller
        name="contactInfo.email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-email"
            >
              Email
            </FieldLabel>
            <Input
              {...field}
              id="checkout-email"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="contactInfo.subscribe"
        control={form.control}
        render={({ field }) => (
          <Field orientation="horizontal">
            <Checkbox
              id="checkout-subscribe"
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="checkout-subscribe" className="font-normal">
              Email me with news and offers
            </FieldLabel>
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const AddressFields = () => {
  const form = useFormContext();

  return (
    <FieldGroup className="gap-3.5">
      <Controller
        name="address.country"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-country"
            >
              Country
            </FieldLabel>
            <Input
              {...field}
              id="checkout-country"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-3.5 max-sm:flex-col">
        <Controller
          name="address.firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-firstName"
              >
                First Name
              </FieldLabel>
              <Input
                {...field}
                id="checkout-firstName"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address.lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-lastName"
              >
                Last Name
              </FieldLabel>
              <Input
                {...field}
                id="checkout-lastName"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="address.address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-address"
            >
              Address
            </FieldLabel>
            <Input
              {...field}
              id="checkout-address"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex gap-3.5 max-sm:flex-col">
        <Controller
          name="address.postalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-postalCode"
              >
                Postal Code
              </FieldLabel>
              <Input
                {...field}
                id="checkout-postalCode"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="address.city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-city"
              >
                City
              </FieldLabel>
              <Input
                {...field}
                id="checkout-city"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="address.phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              className="text-sm font-normal"
              htmlFor="checkout-phone"
            >
              Phone
            </FieldLabel>
            <Input
              {...field}
              id="checkout-phone"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

const ShippingMethodFields = () => {
  const form = useFormContext();

  return (
    <Controller
      name="shippingMethod"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field>
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            className="flex max-sm:flex-col"
          >
            <FieldLabel htmlFor="checkout-shippingMethod-1">
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldTitle>UPS</FieldTitle>
                  <FieldDescription>Delivery: Tomorrow</FieldDescription>
                </FieldContent>
                <div className="flex gap-3.5">
                  <p className="text-sm">$10.00</p>
                  <RadioGroupItem
                    value="UPS"
                    id="checkout-shippingMethod-1"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="checkout-shippingMethod-2">
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldTitle>FedEx</FieldTitle>
                  <FieldDescription>Delivery: Next Week</FieldDescription>
                </FieldContent>
                <div className="flex gap-3.5">
                  <p className="text-sm">$2.99</p>
                  <RadioGroupItem
                    value="FedEx"
                    id="checkout-shippingMethod-2"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              </Field>
            </FieldLabel>
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const PaymentFields = () => {
  const form = useFormContext();
  const paymentMethod = form.watch("payment.method") as PaymentMethod;

  return (
    <div className="space-y-7">
      <Controller
        name="payment.method"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
            >
              <FieldLabel htmlFor="checkout-payment-method-1">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent className="flex-1">
                    <FieldTitle>Credit Card</FieldTitle>
                  </FieldContent>
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/visa-icon.svg"
                    alt="Credit Card"
                    className="size-5"
                  />
                  <RadioGroupItem
                    value="creditCard"
                    id="checkout-payment-method-1"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="checkout-payment-method-2">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent className="flex-1">
                    <FieldTitle>PayPal</FieldTitle>
                  </FieldContent>
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/paypal-icon.svg"
                    alt="PayPal"
                    className="size-5"
                  />
                  <RadioGroupItem
                    value="paypal"
                    id="checkout-payment-method-2"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="checkout-payment-method-3">
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>Online Bank Transfer</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem
                    value="onlineBankTransfer"
                    id="checkout-payment-method-3"
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <PaymentFieldsByMethod method={paymentMethod} />
    </div>
  );
};

const PaymentFieldsByMethod = ({ method }: { method: PaymentMethod }) => {
  const form = useFormContext();

  if (!method) return;

  switch (method) {
    case PAYMENT_METHODS.creditCard:
      return (
        <div className="space-y-3.5">
          <Controller
            name="payment.cardholderName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-cardholderName"
                >
                  Cardholder Name
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-cardholderName"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="payment.cardNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-cardNumber"
                >
                  Card Number
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-cardNumber"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className="flex gap-3.5 max-sm:flex-col">
            <DateInput />
            <Controller
              name="payment.cvc"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-sm font-normal"
                    htmlFor="checkout-payment-cvc"
                  >
                    Card Number
                  </FieldLabel>
                  <Input
                    {...field}
                    id="checkout-payment-cvc"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
      );
    case PAYMENT_METHODS.paypal:
      return (
        <Controller
          name="payment.payPalEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm font-normal"
                htmlFor="checkout-payment-payPalEmail"
              >
                PayPal Email
              </FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="you-email-here@email.com"
                id="checkout-payment-payPalEmail"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      );
    case PAYMENT_METHODS.onlineBankTransfer:
      return (
        <div className="space-y-3.5">
          <Controller
            name="payment.bankName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-bankName"
                >
                  Bank Name
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Bank Name"
                  id="checkout-payment-bankName"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="payment.accountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="text-sm font-normal"
                  htmlFor="checkout-payment-accountNumber"
                >
                  Account Number
                </FieldLabel>
                <Input
                  {...field}
                  id="checkout-payment-accountNumber"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      );
    default:
      return null;
  }
};

const DateInput = () => {
  const form = useFormContext();

  return (
    <Controller
      name="payment.expiryDate"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            className="text-sm font-normal"
            htmlFor="checkout-payment-expiryDate"
          >
            Card Number
          </FieldLabel>
          <Input
            {...field}
            onChange={(e) => {
              let val = e.target.value;
              val = val.replace(/[^0-9/]/g, "");

              const prev = field.value ?? "";
              const isDeleting = val.length < prev.length;

              if (!isDeleting) {
                if (val.length === 2 && !val.includes("/")) {
                  val = val + "/";
                }
              }

              if (val.length > 5) {
                val = val.slice(0, 5);
              }

              field.onChange(val);
            }}
            pattern="^(0[1-9]|1[0-2])/[0-9]{2}$"
            placeholder="MM/YY"
            id="checkout-payment-expiryDate"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const Cart = ({ cartItems, form }: CartProps) => {
  const { fields, remove, update, append } = useFieldArray({
    control: form.control,
    name: "products",
  });
  const { addItem } = useCart();

  const formItems = form.watch("products");

  const totalPrice = formItems?.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const handleRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );

  const handleQuantityChange = useCallback(
    (index: number) => (newQty: number) =>
      update(index, { ...fields[index], quantity: newQty }),
    [update, fields]
  );

  // Complementary add-on products
  const addOnProducts = [
    {
      id: "addon-1",
      name: "Extended Warranty Package",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
      price: 2999,
      description: "3-year extended warranty",
    },
    {
      id: "addon-2",
      name: "Installation Service",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
      price: 1999,
      description: "Professional installation",
    },
    {
      id: "addon-3",
      name: "Training & Support Package",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
      price: 1499,
      description: "On-site training included",
    },
  ];

  const handleAddAddOn = (addOn: (typeof addOnProducts)[0]) => {
    const existingIndex = formItems.findIndex((p) => p.product_id === addOn.id);
    if (existingIndex >= 0) {
      update(existingIndex, {
        ...formItems[existingIndex],
        quantity: formItems[existingIndex].quantity + 1,
      });
    } else {
      append({
        product_id: addOn.id,
        quantity: 1,
        price: addOn.price,
      });
    }
    // Also add to cart context
    addItem({
      id: parseInt(addOn.id.replace("addon-", "")) + 1000,
      name: addOn.name,
      image: addOn.image,
      price: `$${addOn.price.toLocaleString()}`,
    });
  };

  return (
    <div>
      <div className="border-b py-7">
        <h2 className="text-lg leading-relaxed font-semibold">Your Cart</h2>
      </div>
      <ul className="space-y-12 py-7">
        {fields.map((field, index) => {
          return (
            <li key={field.id}>
              <CartItem
                {...(cartItems.find(
                  (p) => p.product_id === field.product_id
                ) as CartItem)}
                onRemoveClick={() => handleRemove(index)()}
                onQuantityChange={(newQty: number) =>
                  handleQuantityChange(index)(newQty)
                }
                index={index}
              />
            </li>
          );
        })}
      </ul>

      {/* Add-ons Section */}
      <div className="border-t py-7">
        <h3 className="text-base font-semibold mb-6">Recommended Add-ons</h3>
        <div className="space-y-6">
          {addOnProducts.map((addOn) => {
            const isAdded = formItems.some((p) => p.product_id === addOn.id);
            return (
              <div
                key={addOn.id}
                className="flex gap-4 items-center py-3 hover:bg-muted/50 rounded-lg transition-colors px-2 -mx-2"
              >
                <div className="w-16 h-16 shrink-0">
                  <AspectRatio
                    ratio={1}
                    className="bg-muted rounded-lg overflow-hidden"
                  >
                    <Image
                      src={addOn.image}
                      alt={addOn.name}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{addOn.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {addOn.description}
                    </p>
                    <p className="text-sm font-semibold">
                      ${addOn.price.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={isAdded ? "secondary" : "default"}
                    size="sm"
                    onClick={() => handleAddAddOn(addOn)}
                    className="shrink-0"
                  >
                    {isAdded ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="space-y-3.5 border-y py-7">
          <div className="flex justify-between gap-3">
            <p className="text-sm">Subtotal</p>
            <Price className="text-sm font-normal">
              <PriceValue
                price={totalPrice}
                currency={cartItems[0].price.currency}
                variant="regular"
              />
            </Price>
          </div>
          <div className="flex justify-between gap-3">
            <p className="text-sm">Shipping</p>
            <p className="text-sm">Free</p>
          </div>
          <div className="flex justify-between gap-3">
            <p className="text-sm">Estimated Tax</p>
            <p className="text-sm">$35.80</p>
          </div>
        </div>
        <div className="py-7">
          <div className="flex justify-between gap-3">
            <p className="text-lg leading-tight font-medium">Total</p>
            <Price className="text-xl font-medium">
              <PriceValue
                price={totalPrice}
                currency={cartItems[0].price.currency}
                variant="regular"
              />
            </Price>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({
  image,
  name,
  link,
  details,
  price,
  index,
  onQuantityChange,
  onRemoveClick,
}: CartItemProps) => {
  const { regular, currency } = price;

  return (
    <Card className="rounded-none border-none bg-background p-0 shadow-none">
      <div className="flex w-full gap-3.5 max-sm:flex-col">
        <div className="shrink-0 basis-25">
          <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
            <img
              src={image}
              alt={name}
              className="block size-full object-cover object-center"
            />
          </AspectRatio>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-between gap-3">
            <div className="flex w-full justify-between gap-3">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium">
                  <a href={link}>{name}</a>
                </CardTitle>
                <ProductDetails details={details} />
              </div>
              <div>
                <Price className="text-sm font-semibold">
                  <PriceValue
                    price={regular}
                    currency={currency}
                    variant="regular"
                  />
                </Price>
              </div>
            </div>
            <div className="flex w-full justify-between gap-3">
              <QuantityField
                index={index}
                onQuantityChange={onQuantityChange}
              />
              <Button size="icon" variant="ghost" onClick={onRemoveClick}>
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ProductDetails = ({
  details,
}: {
  details?: {
    label: string;
    value: string;
  }[];
}) => {
  if (!details) return;
  return (
    <ul>
      {details?.map((item, index) => {
        const isLast = index === details.length - 1;

        return (
          <li className="inline" key={`product-details-${index}`}>
            <dl className="inline text-xs text-muted-foreground">
              <dt className="inline">{item.label}: </dt>
              <dd className="inline">{item.value}</dd>
              {!isLast && <span className="mx-1 text-muted-foreground">/</span>}
            </dl>
          </li>
        );
      })}
    </ul>
  );
};

const QuantityField = ({
  index,
  onQuantityChange,
}: {
  index: number;
  onQuantityChange: (n: number) => void;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={`products.${index}.quantity`}
      control={control}
      render={({ field }) => {
        return (
          <Field className="w-full max-w-28">
            <QuantityInput
              inputProps={field}
              onValueChange={(newQty) => {
                field.onChange(newQty);
                onQuantityChange(newQty);
              }}
              className="rounded-none"
            />
          </Field>
        );
      }}
    />
  );
};

export { Checkout1 };
