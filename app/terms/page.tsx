"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* BACK BUTTON */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-8"
      >
        ← Back
      </Button>

      {/* CARD */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            California Privacy Policy
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 text-muted-foreground leading-8">

          {/* HEADER INFO */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-foreground">
                Universal AI Services
              </span>
            </p>

            <p>
              <span className="font-semibold text-foreground">
                Effective Date:
              </span>{" "}
              May 15, 2026
            </p>

            <p>
              <span className="font-semibold text-foreground">
                Website:
              </span>{" "}
              universalaiservices.com
            </p>

            <p>
              <span className="font-semibold text-foreground">
                Contact:
              </span>{" "}
              contact@universalaiservices.com
            </p>
          </div>

          {/* INTRO */}
          <section className="space-y-4">
            <p>
              Universal AI Services (“UAIS,” “we,” “our,” or “us”)
              respects your privacy. This California Privacy Policy
              explains how we collect, use, disclose, and protect
              personal information when you visit our website,
              contact us, register for events, request robotics or AI
              services, purchase or rent products, use our marketplace,
              or communicate with us.
            </p>

            <p>
              This policy is intended to comply with applicable
              California privacy laws, including the California Consumer
              Privacy Act, as amended by the California Privacy Rights
              Act, where applicable. The CCPA gives California consumers
              rights to know, delete, correct, opt out of certain data
              uses, and avoid discrimination for exercising privacy rights.
            </p>
          </section>

          {/* SECTION 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              1. Information We Collect
            </h2>

            <p>
              We may collect the following categories of personal
              information:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>
                <span className="font-semibold text-foreground">
                  Contact information:
                </span>{" "}
                name, email address, phone number, company name,
                job title, mailing address, and billing information.
              </li>

              <li>
                <span className="font-semibold text-foreground">
                  Business and transaction information:
                </span>{" "}
                service requests, product inquiries, rental details,
                event registrations, invoices, payments, quotes,
                support requests, repair history, procurement details,
                and communications with UAIS.
              </li>

              <li>
                <span className="font-semibold text-foreground">
                  Website and device information:
                </span>{" "}
                IP address, browser type, device identifiers,
                pages viewed, referral source, cookies, analytics data,
                and usage activity.
              </li>

              <li>
                <span className="font-semibold text-foreground">
                  Robotics, AI, and operational information:
                </span>{" "}
                project requirements, deployment details, robot service
                records, technical support information, software or
                integration details, and related operational data.
              </li>

              <li>
                <span className="font-semibold text-foreground">
                  Marketing and communications information:
                </span>{" "}
                email preferences, event attendance, messages,
                survey responses, and interactions with UAIS content
                or campaigns.
              </li>
            </ul>

            <p>
              We do not intentionally collect sensitive personal
              information unless necessary for a specific service,
              legal obligation, safety purpose, payment process,
              or written agreement.
            </p>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              2. How We Use Personal Information
            </h2>

            <p>We may use personal information to:</p>

            <ul className="list-disc pl-6 space-y-3">
              <li>
                Provide, operate, and improve our website,
                marketplace, robotics services, AI consulting,
                rentals, repairs, deployments, events,
                and customer support.
              </li>

              <li>
                Respond to inquiries, prepare quotes, process orders,
                coordinate logistics, manage event registration,
                verify payments, and communicate with customers,
                vendors, partners, and attendees.
              </li>

              <li>
                Improve safety, security, fraud prevention,
                service quality, product recommendations,
                analytics, marketing, and business operations.
              </li>

              <li>
                Comply with legal obligations, enforce agreements,
                protect our rights, and respond to lawful requests.
              </li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              3. How We Share Personal Information
            </h2>

            <p>
              We may share personal information with service providers,
              contractors, payment processors, event platforms,
              logistics providers, robotics vendors, repair partners,
              hosting providers, analytics providers, legal/accounting
              advisors, and business partners when reasonably necessary
              to operate UAIS.
            </p>

            <p>
              We may also disclose information if required by law,
              to protect safety or rights, in connection with a
              business transaction, or with your consent.
            </p>

            <p>
              UAIS does not sell personal information in the ordinary
              sense. If we ever engage in activity that legally
              qualifies as “selling” or “sharing” personal information
              under California law, we will provide the required notice
              and opt-out rights.
            </p>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              4. Cookies and Analytics
            </h2>

            <p>
              Our website may use cookies, pixels, analytics tools,
              or similar technologies to understand traffic,
              improve performance, remember preferences,
              and support marketing. You can adjust your browser
              settings to limit cookies, but some website features
              may not function properly.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              5. Data Retention and Security
            </h2>

            <p>
              We retain personal information for as long as reasonably
              necessary to provide services, complete transactions,
              maintain records, resolve disputes, comply with legal
              obligations, and operate our business.
            </p>

            <p>
              We use reasonable administrative, technical,
              and organizational safeguards to protect personal
              information. However, no website, internet transmission,
              email, AI tool, robotics system, or storage system is
              completely secure.
            </p>
          </section>

          {/* SECTION 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              6. California Privacy Rights
            </h2>

            <p>
              California residents may have the right to:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>
                Know what personal information we collect, use,
                disclose, sell, or share.
              </li>

              <li>
                Request access to personal information.
              </li>

              <li>
                Request deletion of personal information,
                subject to legal exceptions.
              </li>

              <li>
                Request correction of inaccurate personal information.
              </li>

              <li>
                Opt out of the sale or sharing of personal information,
                where applicable.
              </li>

              <li>
                Limit use of sensitive personal information,
                where applicable.
              </li>

              <li>
                Not be discriminated against for exercising
                privacy rights.
              </li>
            </ul>
          </section>

          {/* SECTION 7 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              7. How to Submit a Privacy Request
            </h2>

            <p>
              To submit a California privacy request, email us at:
            </p>

            <p className="font-medium text-foreground">
              contact@universalaiservices.com
            </p>

            <p>
              Subject line: California Privacy Request
            </p>

            <p>
              Please include your name, contact information,
              and the nature of your request. We may need to verify
              your identity before responding. Authorized agents
              may submit requests where permitted by law,
              subject to verification.
            </p>
          </section>

          {/* SECTION 8 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              8. Children’s Privacy
            </h2>

            <p>
              Our website and services are intended for business users
              and adults. We do not knowingly collect personal
              information from children under 13. If you believe
              a child has provided us personal information,
              contact us and we will take appropriate action.
            </p>
          </section>

          {/* SECTION 9 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              9. Updates to This Policy
            </h2>

            <p>
              We may update this California Privacy Policy
              from time to time. The updated version will be posted
              on this page with a revised effective date.
            </p>
          </section>

          {/* SECTION 10 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              10. Contact
            </h2>

            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                Universal AI Services
              </p>

              <p>
                Email: contact@universalaiservices.com
              </p>

              <p>
                Website: universalaiservices.com
              </p>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}