"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-8"
      >
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Universal AI Services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily access the materials on Universal AI Services for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Products and Services</h2>
              <p className="text-muted-foreground">
                All products and services are subject to availability. We reserve the right to discontinue any product or service at any time. Prices are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Consultations</h2>
              <p className="text-muted-foreground">
                Some products and services require consultation before purchase. By scheduling a consultation, you agree to provide accurate information and attend scheduled appointments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Universal AI Services shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us through our consultation booking system or contact form.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

