"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Minus, Plus, ArrowLeft, X, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useMemo, useEffect } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import z from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Initialize Stripe only if publishable key is available
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { logger } from "@/lib/logger";

import Image from "next/image";
import { Price, PriceValue } from "@/components/shadcnblocks/price";
import QuantityInput from "@/components/shadcnblocks/quantity-input";
import { StripePaymentForm } from "@/components/stripe-payment-form";
import { AddOnConsultationModal } from "@/components/addon-consultation-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import accessoryData from "@/app/data.json";
import buyData from "@/app/services/buy/data/buy_data.json";

interface ProductPrice {
  regular: number;
  sale?: number;
  currency: string;
  consultationRequired?: boolean;
}

type CartItem = {
  product_id: string;
  link: string;
  name: string;
  image: string;
  price: ProductPrice & { consultationRequired?: boolean };
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
  const router = useRouter();
  const [activeAccordion, setActiveAccordion] = useState("item-1");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  const defaultProducts = cartItems.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price.sale ?? item.price.regular,
    consultationRequired: item.price.consultationRequired || false,
  }));

  // Calculate total amount (exclude consultation-required items)
  const totalAmount = useMemo(() => {
    return defaultProducts.reduce((sum, p) => {
      // Don't include consultation-required items in total
      if (p.consultationRequired) return sum;
      return sum + p.price * p.quantity;
    }, 0);
  }, [defaultProducts]);

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      payment: {
        method: PAYMENT_METHODS.creditCard,
      },
      products: defaultProducts,
    },
  });

  // Create payment intent when payment accordion is opened
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (
        activeAccordion === "item-4" &&
        !clientSecret &&
        totalAmount > 0 &&
        stripePromise
      ) {
        setIsCreatingPaymentIntent(true);
        setPaymentError(null);
        try {
          const response = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: totalAmount,
              currency: "usd",
            }),
          });

          const data = await response.json();
          if (data.error) {
            setPaymentError(data.error);
          } else if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setPaymentError("Failed to receive payment client secret");
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            setPaymentError(error.message);
          } else {
            setPaymentError("Failed to initialize payment");
          }
        } finally {
          setIsCreatingPaymentIntent(false);
        }
      }
    };

    createPaymentIntent();
  }, [activeAccordion, clientSecret, totalAmount]);

  // Reset client secret when total amount changes (e.g., cart items updated)
  useEffect(() => {
    if (clientSecret && activeAccordion === "item-4") {
      // Reset client secret when amount changes to create a new payment intent
      setClientSecret(null);
    }
  }, [totalAmount]);

  const handlePaymentSuccess = () => {
    const formData = form.getValues();
    // Payment success is handled by onSuccess callback
    if (onSuccess) {
      onSuccess();
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const onContinue = (value: string) => {
    setActiveAccordion(value);
    setPaymentError(null);
  };

  const handleOnValueChange = (value: string) => {
    setActiveAccordion(value);
    setPaymentError(null);
    // Reset client secret when navigating away from payment section
    if (value !== "item-4") {
      setClientSecret(null);
    }
  };

  return (
    <section className={cn("py-16 md:py-24 p-10", className)}>
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-2 text-black dark:text-white hover:opacity-70 transition-opacity w-fit"
            >
              <X className="h-5 w-5" />
              <span className="text-lg font-semibold">Close</span>
            </button>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Checkout
              </h1>
              <p className="text-sm text-muted-foreground md:text-base">
                Complete your purchase securely
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/services/buy"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors border border-border rounded-lg hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>
          </div>
        </div>
        <FormProvider {...form}>
          <div>
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
                        {paymentError && (
                          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive">
                              {paymentError}
                            </p>
                          </div>
                        )}
                        {stripePromise ? (
                          clientSecret ? (
                            <Elements
                              stripe={stripePromise}
                              options={{
                                clientSecret,
                                appearance: {
                                  theme: "stripe",
                                },
                              }}
                            >
                              <StripePaymentForm
                                amount={totalAmount}
                                clientSecret={clientSecret}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                              />
                            </Elements>
                          ) : isCreatingPaymentIntent ? (
                            <div className="flex items-center justify-center py-12">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span className="text-sm text-muted-foreground">
                                  Initializing payment...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-6 border border-muted rounded-lg bg-muted/50">
                              <p className="text-sm text-muted-foreground">
                                Please complete the previous steps to proceed
                                with payment.
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="p-6 border border-destructive/20 rounded-lg bg-destructive/5">
                            <p className="text-sm font-medium text-destructive mb-2">
                              Stripe Payment Not Configured
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              Please add your Stripe publishable key to the
                              environment variables to enable payment
                              processing.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Add{" "}
                              <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                              </code>{" "}
                              to your{" "}
                              <code className="px-1.5 py-0.5 bg-muted rounded text-xs">
                                .env.local
                              </code>{" "}
                              file.
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div>
                <Cart form={form} cartItems={cartItems} />
              </div>
            </div>
          </div>
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

// Helper function to extract file ID from Google Drive URL
const extractFileId = (url: string): string | null => {
  if (typeof url !== "string") return null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
};

// Helper function to convert Google Drive URL to direct view URL
const convertGoogleDriveUrl = (url: string): string => {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
  }

  if (
    url.includes("uc?export=view") ||
    url.includes("uc?export=download") ||
    url.includes("/preview")
  ) {
    return url;
  }

  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  if (url.startsWith("http")) {
    return url;
  }

  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Helper function to convert Google Drive URL to direct image URL (same as accessories page)
const getImageUrl = (url: string): string => {
  if (typeof url !== "string") {
    return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
  }

  if (url.includes("drive.google.com")) {
    const fileId = extractFileId(url);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // If it's already a direct URL, return it
  if (url.startsWith("http")) {
    return url;
  }

  // Fallback
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  if (typeof url !== "string") return false;
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to get product image from buy_data.json
// Using the exact same logic as hero.tsx
const getBuyProductImage = (item: {
  Images?: string | string[];
  "Location ID"?: string | string[];
  [key: string]: unknown;
}): string => {
  // If Images field exists and has URLs, use the first one
  if (item.Images && Array.isArray(item.Images) && item.Images.length > 0) {
    const firstImage = item.Images[0];
    // Skip if it's a video
    if (typeof firstImage === "string" && !isVideoUrl(firstImage)) {
      return firstImage;
    }
  }
  if (
    item.Images &&
    typeof item.Images === "string" &&
    !isVideoUrl(item.Images)
  ) {
    return item.Images;
  }

  // Check if Location ID is an array of Google Drive links
  const locationId = item["Location ID"];
  if (Array.isArray(locationId) && locationId.length > 0) {
    // Find first non-video item
    for (const link of locationId) {
      if (typeof link === "string") {
        // Skip videos
        if (isVideoUrl(link)) continue;

        if (link.includes("drive.google.com")) {
          const fileId = extractFileId(link);
          if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId}`;
          }
        } else if (link.startsWith("http")) {
          // Direct image URL
          return link;
        }
      }
    }
  }

  // Try to extract from single Google Drive link (string)
  if (
    typeof locationId === "string" &&
    locationId.includes("drive.google.com") &&
    !isVideoUrl(locationId)
  ) {
    const fileId = extractFileId(locationId);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  // Fallback to placeholder
  return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
};

// Get recommended products from buy_data.json
const getRecommendedProducts = () => {
  // Filter only "Buy" category products (exclude accessories)
  const buyProducts = buyData.filter((item) => item.Category === "Buy");

  return buyProducts.slice(0, 6).map((item, index) => {
    const msrp = parseFloat(
      item.MSRP?.toString().replace(/[^0-9.]/g, "") || "0"
    );
    const price =
      msrp > 0 ? `From $${msrp.toLocaleString()}` : "Price on request";

    const imageUrl = getBuyProductImage(item);

    return {
      id: item["Product ID"] || item.SKU || `product-${index}`,
      name: item["Model Name"] || "Product",
      description: item["Short Description"] || item.Description || "",
      category: item.Category || "Buy",
      image: imageUrl,
      price: price,
    };
  });
};

// Get recommended accessories with their images
const getRecommendedAddOns = () => {
  return accessoryData.accessories_addons
    .slice(0, 6)
    .map((accessory, index) => {
      // Get first image from images array
      let imageUrl =
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
      if (
        accessory.images &&
        Array.isArray(accessory.images) &&
        accessory.images.length > 0
      ) {
        imageUrl = getImageUrl(accessory.images[0]);
      }

      return {
        id:
          accessory["Product ID"] ||
          accessory.SKU ||
          accessory.name ||
          `accessory-${index}`,
        name: accessory.name || "Accessory",
        emoji: "🔧", // Default emoji for accessories
        description:
          accessory["Short Description"] || accessory.Description || "",
        category: accessory.Category || "Accessories+Add-ons",
        image: imageUrl,
      };
    });
};

const Cart = ({ cartItems: initialCartItems, form }: CartProps) => {
  const { fields, remove, update, append } = useFieldArray({
    control: form.control,
    name: "products",
  });
  const { addItem, items: cartContextItems } = useCart();

  // Convert cart context items to checkout format and merge with initial cartItems
  const cartItems = useMemo(() => {
    // Convert cart context items to checkout format
    const contextItemsAsCheckout = cartContextItems.map((item) => {
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
      const isConsultationRequired =
        priceValue === 0 ||
        item.price.toLowerCase().includes("consultation") ||
        item.price.toLowerCase().includes("request");

      return {
        product_id: String(item.id), // Convert to string to match CartItem type
        link: "#",
        name: item.name,
        image: item.image,
        price: {
          regular: priceValue,
          currency: "USD",
          consultationRequired: isConsultationRequired,
        },
        quantity: item.quantity,
        details: [],
      };
    });

    // Merge with initial cartItems, avoiding duplicates
    // Normalize product_id format: remove "product-" prefix for matching
    const normalizeProductId = (id: string | number) => {
      const idStr = String(id);
      return idStr.replace(/^product-/, "");
    };

    const mergedItems = [...initialCartItems];
    contextItemsAsCheckout.forEach((contextItem) => {
      const normalizedContextId = normalizeProductId(contextItem.product_id);
      const existingItem = mergedItems.find(
        (item) => normalizeProductId(item.product_id) === normalizedContextId
      );

      if (!existingItem) {
        // New item: use the format from contextItem (matches form's product_id format)
        mergedItems.push(contextItem);
      } else {
        // Update existing item with latest data from context
        const existingIndex = mergedItems.findIndex(
          (item) => normalizeProductId(item.product_id) === normalizedContextId
        );
        if (existingIndex !== -1) {
          mergedItems[existingIndex] = {
            ...mergedItems[existingIndex],
            ...contextItem,
            // Preserve the original product_id format from initialCartItems
            product_id: mergedItems[existingIndex].product_id,
            // But update quantity if it changed
            quantity: contextItem.quantity,
          };
        }
      }
    });

    return mergedItems;
  }, [cartContextItems, initialCartItems]);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedAddOnForConsultation, setSelectedAddOnForConsultation] =
    useState<{
      id: string;
      name: string;
      image: string;
      priceStr: string;
      description: string;
    } | null>(null);
  const recommendedProducts = useMemo(() => getRecommendedProducts(), []);
  const recommendedAddOns = useMemo(() => getRecommendedAddOns(), []);

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

  const handleAddProductToCart = useCallback(
    (product: {
      id: string;
      name: string;
      image: string;
      price: string;
      description?: string;
    }) => {
      // Check if product has a valid price (not "Price on request" or empty)
      const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0;
      const hasValidPrice =
        priceValue > 0 && !product.price.toLowerCase().includes("request");

      // Check if consultation has already been scheduled
      const consultationScheduled =
        sessionStorage.getItem("consultationScheduled") === "true";

      // If no valid price and consultation not scheduled, open consultation modal
      if (!hasValidPrice && !consultationScheduled) {
        setSelectedAddOnForConsultation({
          id: product.id,
          name: product.name,
          image: product.image,
          priceStr: product.price || "Consultation Required",
          description: product.description || "",
        });
        setIsConsultationModalOpen(true);
        return;
      }

      // If no valid price but consultation already scheduled, add silently
      if (!hasValidPrice && consultationScheduled) {
        addItem({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price || "Consultation Required",
        });

        append({
          product_id: product.id,
          quantity: 1,
          price: 0, // Price is 0 for consultation items until finalized
        });
        return;
      }

      // Normal flow: product has a valid price
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
      });

      append({
        product_id: product.id,
        quantity: 1,
        price: priceValue,
      });
    },
    [append, addItem]
  );

  const handleAddOnConsultationClick = useCallback(
    (addOn: {
      id: string;
      name: string;
      image: string;
      description: string;
      category: string;
    }) => {
      // Set the selected add-on for consultation modal
      setSelectedAddOnForConsultation({
        id: addOn.id,
        name: addOn.name,
        image: addOn.image,
        priceStr: "Consultation Required",
        description: addOn.description,
      });
      setIsConsultationModalOpen(true);
    },
    []
  );

  const handleConsultationScheduled = useCallback(
    (addOnId: string) => {
      // Mark consultation as scheduled in sessionStorage
      sessionStorage.setItem("consultationScheduled", "true");

      // Find the add-on or product that was scheduled
      const addOn = recommendedAddOns.find((a) => a.id === addOnId);
      const product = recommendedProducts.find((p) => p.id === addOnId);

      if (addOn) {
        // Add add-on to cart context as a consultation-required item
        addItem({
          id: `addon-${addOn.id}`,
          name: addOn.name,
          image: addOn.image || "",
          price: "Consultation Required",
          addOns: [
            {
              id: addOn.id,
              name: addOn.name,
              price: 0, // Add-ons don't have prices, consultation required
            },
          ],
        });

        // Add to form's products array with price 0 (consultation required)
        append({
          product_id: `addon-${addOn.id}`,
          quantity: 1,
          price: 0,
        });
      } else if (product) {
        // Add product from "You May Also Like" to cart context as a consultation-required item
        addItem({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price || "Consultation Required",
        });

        // Add to form's products array with price 0 (consultation required)
        append({
          product_id: product.id,
          quantity: 1,
          price: 0,
        });
      }
      setIsConsultationModalOpen(false); // Close modal after scheduling
    },
    [recommendedAddOns, recommendedProducts, addItem, append]
  );

  return (
    <div>
      <div className="border-b py-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg leading-relaxed font-semibold">Your Cart</h2>
          <Link
            href="/services/buy"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Continue Shopping
          </Link>
        </div>
      </div>
      {fields.length === 0 ? (
        <div className="py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>
          <Link href="/services/buy">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Go to Marketplace
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="space-y-12 py-7">
          {fields.map((field, index) => {
            return (
              <li key={field.id}>
                {(() => {
                  // Normalize product_id for matching (handle both "GO2-PRO-0001" and "product-GO2-PRO-0001" formats)
                  const normalizeProductId = (id: string | number) => {
                    const idStr = String(id);
                    return idStr.replace(/^product-/, "");
                  };
                  const normalizedFieldId = normalizeProductId(
                    field.product_id
                  );

                  // Try to find cartItem by normalized product_id
                  const cartItem = cartItems.find(
                    (p) =>
                      normalizeProductId(p.product_id) === normalizedFieldId
                  );

                  // Safety check: ensure cartItem exists and has valid price structure
                  if (
                    !cartItem ||
                    !cartItem.price ||
                    typeof cartItem.price !== "object"
                  ) {
                    logger.warn(
                      `CartItem not found or invalid for product_id: ${field.product_id}`,
                      {
                        normalizedFieldId,
                        availableProductIds: cartItems.map((c) => ({
                          original: c.product_id,
                          normalized: normalizeProductId(c.product_id),
                        })),
                      }
                    );
                    return null; // Skip rendering if item not found or price is invalid
                  }
                  return (
                    <CartItem
                      {...cartItem}
                      onRemoveClick={() => handleRemove(index)()}
                      onQuantityChange={(newQty: number) =>
                        handleQuantityChange(index)(newQty)
                      }
                      index={index}
                    />
                  );
                })()}
              </li>
            );
          })}
        </ul>
      )}

      {/* Recommended Add-Ons Section */}
      {fields.length > 0 && recommendedAddOns.length > 0 && (
        <div className="border-t py-7">
          <h3 className="text-base font-semibold mb-6">Recommended Add-Ons</h3>
          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-4 min-w-max">
              {recommendedAddOns.map((addOn) => {
                return (
                  <div
                    key={addOn.id}
                    className="w-48 shrink-0 flex flex-col gap-3 group"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                      {addOn.image ? (
                        <Image
                          src={addOn.image}
                          alt={addOn.name}
                          fill
                          sizes="192px"
                          className="object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Fallback to emoji if image fails to load
                            target.style.display = "none";
                            const emojiDiv =
                              target.nextElementSibling as HTMLElement;
                            if (emojiDiv) {
                              emojiDiv.style.display = "flex";
                            }
                          }}
                          loading="lazy"
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          addOn.image ? "hidden" : "flex"
                        }`}
                        style={{ display: addOn.image ? "none" : "flex" }}
                      >
                        <div className="text-6xl">{addOn.emoji}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1 justify-between">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">
                          {addOn.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {addOn.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {addOn.category}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleAddOnConsultationClick(addOn)}
                      >
                        Consultation Required
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* You May Also Like Section */}
      {fields.length > 0 && recommendedProducts.length > 0 && (
        <div className="border-t py-7">
          <h3 className="text-base font-semibold mb-6">You May Also Like</h3>
          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-4 min-w-max">
              {recommendedProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="w-48 shrink-0 flex flex-col gap-3 group"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="192px"
                          className="object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1 flex-1 justify-between">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        {product.price && (
                          <p className="text-xs font-medium text-primary mt-1">
                            {product.price}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() =>
                          handleAddProductToCart({
                            ...product,
                            description: product.description,
                          })
                        }
                      >
                        {(() => {
                          const priceValue =
                            parseFloat(product.price.replace(/[^0-9.]/g, "")) ||
                            0;
                          const hasValidPrice =
                            priceValue > 0 &&
                            !product.price.toLowerCase().includes("request");
                          const consultationScheduled =
                            typeof window !== "undefined" &&
                            sessionStorage.getItem("consultationScheduled") ===
                              "true";

                          if (!hasValidPrice && !consultationScheduled) {
                            return "Consultation Required";
                          }
                          return "Add to Cart";
                        })()}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add-On Consultation Modal */}
      <AddOnConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => {
          setIsConsultationModalOpen(false);
          setSelectedAddOnForConsultation(null);
        }}
        addOn={selectedAddOnForConsultation}
        onConsultationScheduled={handleConsultationScheduled}
      />

      <div>
        <div className="space-y-3.5 border-y py-7">
          <div className="flex justify-between gap-3">
            <p className="text-sm">Subtotal</p>
            <Price className="text-sm font-normal">
              <PriceValue
                price={totalPrice}
                currency={cartItems[0]?.price?.currency || "USD"}
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
                currency={cartItems[0]?.price?.currency || "USD"}
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
  // Safety check: ensure price exists and has required properties
  if (!price || typeof price !== "object") {
    logger.error("CartItem: Invalid price structure", new Error("Invalid price structure"), { price, name });
    return null;
  }

  const { regular = 0, currency = "USD", consultationRequired = false } = price;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const imageUrl = convertGoogleDriveUrl(image);

  return (
    <Card className="rounded-none border-none bg-background p-0 shadow-none">
      <div className="flex w-full gap-3.5 max-sm:flex-col">
        <div className="shrink-0 basis-25">
          <AspectRatio
            ratio={1}
            className="overflow-hidden rounded-lg bg-muted"
          >
            {imageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 640px) 100px, 100px"
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                <p className="text-xs">Image unavailable</p>
              </div>
            )}
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
                {consultationRequired ? (
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <span>$0</span>
                    <span className="text-xs text-muted-foreground">*</span>
                    <span className="text-xs text-muted-foreground">
                      Price to be decided
                    </span>
                  </div>
                ) : (
                  <Price className="text-sm font-semibold">
                    <PriceValue
                      price={regular}
                      currency={currency}
                      variant="regular"
                    />
                  </Price>
                )}
              </div>
            </div>
            <div className="flex w-full justify-between gap-3">
              <QuantityField
                index={index}
                onQuantityChange={onQuantityChange}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={onRemoveClick}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
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
