"use client";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground">
          <p className="text-sm text-muted-foreground">
            Last updated: January 14, 2026
          </p>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
            <p>
              What&apos;sOnTbilisi (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) operates a public event discovery and social
              platform. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our website
              and services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              2. Information We Collect
            </h2>
            <p>
              <strong>Account Information:</strong> When you sign up, we collect
              your email address, username, profile picture, and bio.
            </p>
            <p>
              <strong>Activity Data:</strong> When you create, edit, or interact
              with activities/events, we collect the event details, images,
              location data, and timestamps.
            </p>
            <p>
              <strong>Social Interactions:</strong> We collect data about
              activities you join, people you follow, and comments you post.
            </p>
            <p>
              <strong>Location Data:</strong> When you use the map feature or
              create activities, we collect geographic coordinates. This is used
              only to display activities on a map and is not shared with third
              parties.
            </p>
            <p>
              <strong>Technical Data:</strong> We automatically collect device
              type, browser type, IP address (for security), and usage patterns
              through analytics.
            </p>
            <p>
              <strong>Images:</strong> When you upload images, we store them in
              our cloud storage (Cloudflare R2) with a reference linking to your
              account.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              3. How We Use Your Information
            </h2>
            <ul className="list-inside list-disc space-y-2">
              <li>To provide and maintain the service</li>
              <li>To notify you of changes or updates</li>
              <li>
                To allow you to participate in activities and social features
              </li>
              <li>To monitor and analyze trends and usage (for improvement)</li>
              <li>To detect, prevent, and address fraud and security issues</li>
              <li>
                To send occasional updates about new features (opt-out
                available)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Data Retention</h2>
            <p>
              We retain your data as long as your account is active. If you
              delete your account, we will delete your personal data (name,
              email, profile) within 30 days. Activities you created and
              comments you posted remain visible to maintain content integrity,
              but are disassociated from your profile. Your data may be retained
              longer if required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              5. Third-Party Services
            </h2>
            <p>We use the following third-party services:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Supabase:</strong> Authentication and database services
              </li>
              <li>
                <strong>Cloudflare R2:</strong> Image storage and delivery
              </li>
              <li>
                <strong>Google Maps:</strong> Location services and map display
              </li>
              <li>
                <strong>Sentry:</strong> Error tracking and performance
                monitoring
              </li>
              <li>
                <strong>Vercel:</strong> Web hosting and deployment
              </li>
            </ul>
            <p className="mt-2">
              These services may collect data as outlined in their respective
              privacy policies. We recommend reviewing their policies.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              6. Your Privacy Rights (GDPR & CCPA)
            </h2>
            <p>
              <strong>Right to Access:</strong> You can request a copy of your
              personal data by contacting us. We will provide it within 30 days.
            </p>
            <p>
              <strong>Right to Deletion (Right to be Forgotten):</strong> You
              can request deletion of your account and associated personal data.
              We will comply within 30 days, with exceptions for legally
              mandated retention.
            </p>
            <p>
              <strong>Right to Rectification:</strong> You can update your
              account information directly in your profile settings.
            </p>
            <p>
              <strong>Right to Data Portability:</strong> You can request your
              data in a machine-readable format (JSON).
            </p>
            <p>
              To exercise any of these rights, email us at
              <code className="mx-1 rounded bg-muted px-2 py-1">
                privacy@whatson-tbilisi.com
              </code>
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Cookies</h2>
            <p>
              <strong>Session Cookie:</strong> We use a single session cookie to
              keep you logged in. This is essential and cannot be disabled.
            </p>
            <p>
              <strong>Analytics Cookies (Optional):</strong> We use analytics to
              understand how users interact with our service. You can opt-out
              via our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Security</h2>
            <p>We use industry-standard security practices, including:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>Encrypted data in transit (HTTPS/TLS)</li>
              <li>Encrypted database connections</li>
              <li>Secure password hashing (Supabase auth)</li>
              <li>Row-level security policies on the database</li>
              <li>Regular security audits and monitoring</li>
            </ul>
            <p className="mt-2">
              However, no system is 100% secure. Please use strong passwords and
              keep your account credentials private.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              9. User-Generated Content
            </h2>
            <p>
              Activities, images, and comments you post are visible to other
              users on the platform. By posting, you grant What&apos;sOnTbilisi
              a license to display this content as part of the service. You
              remain the copyright owner and can delete your own content
              anytime.
            </p>
            <p>
              We monitor for and remove content that violates our Terms of
              Service (spam, harassment, abuse, etc.).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              10. Children&apos;s Privacy
            </h2>
            <p>
              Our service is not intended for users under 13 years old. We do
              not knowingly collect data from children under 13. If we learn
              that we have collected such data, we will delete it immediately.
              Parents or guardians who believe we have collected data about a
              child should contact us.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy here and
              updating the &quot;Last updated&quot; date. Continued use of the
              service constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy
              practices, contact us at:
            </p>
            <div className="mt-4 rounded border border-muted bg-muted/50 p-4">
              <p>
                <strong>Email:</strong>
                <code className="mx-1 rounded bg-background px-2 py-1">
                  privacy@whatson-tbilisi.com
                </code>
              </p>
              <p className="mt-2">
                <strong>Address:</strong> Tbilisi, Georgia
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
