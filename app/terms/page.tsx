"use client";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground">
          <p className="text-sm text-muted-foreground">
            Last updated: January 14, 2026
          </p>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing and using What&apos;sOnTbilisi (&quot;the
              Service&quot;), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the
              above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. License to Use</h2>
            <p>
              What&apos;sOnTbilisi grants you a limited, non-exclusive,
              non-transferable license to use the Service for personal,
              non-commercial purposes. You agree not to:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Reproduce, distribute, or transmit the content or functionality
              </li>
              <li>Use automated tools to scrape or bulk download content</li>
              <li>
                Modify, translate, or create derivative works of the Service
              </li>
              <li>
                Use the Service for any commercial purpose without our consent
              </li>
              <li>Attempt to reverse-engineer or hack the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              3. User Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and are responsible for all activity under
              your account. You agree to:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>Maintain the security of your password</li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              4. Prohibited Content & Conduct
            </h2>
            <p>You agree not to post or upload any content that:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Is hateful, abusive, harassing, or discriminatory based on race,
                gender, religion, sexual orientation, etc.
              </li>
              <li>
                Contains sexually explicit material, adult content, or nudity
              </li>
              <li>Is spam, misleading, or fraudulent</li>
              <li>Violates intellectual property rights of others</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>
                Promotes violence, illegal activities, or dangerous behavior
              </li>
              <li>
                Is misinformation or medical/legal advice presented as fact
              </li>
            </ul>
            <p className="mt-2">
              Violations will result in content removal, account suspension, or
              permanent ban at our discretion.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              5. User-Generated Content
            </h2>
            <p>
              <strong>Ownership:</strong> You retain all rights to content you
              create (activities, images, comments). By posting on our Service,
              you grant What&apos;sOnTbilisi a worldwide, non-exclusive,
              royalty-free license to display, distribute, and archive this
              content as part of the Service.
            </p>
            <p>
              <strong>Moderation:</strong> We reserve the right to remove
              content that violates this agreement or our community standards,
              with or without notice.
            </p>
            <p>
              <strong>Deletion:</strong> When you delete content, it is removed
              from the live Service but may remain in backups for up to 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              6. Image Upload Policy
            </h2>
            <p>When you upload images to create or edit activities:</p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Images must be original or you must have rights to use them
              </li>
              <li>
                Images must not violate anyone&apos;s privacy (no doxxing or
                non-consenting photos of people)
              </li>
              <li>
                We scan images for NSFW content and may remove them
                automatically
              </li>
              <li>
                Images are stored indefinitely as long as the activity exists
              </li>
              <li>
                We use Cloudflare R2 for storage; see their terms for details
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              7. Reporting & Moderation
            </h2>
            <p>
              If you encounter content or behavior that violates this agreement:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Use the &quot;Report&quot; button on activities, comments, or
                profiles
              </li>
              <li>Provide details about the violation</li>
              <li>Do not engage with the violator or amplify the content</li>
            </ul>
            <p className="mt-2">
              Our moderation team reviews reports within 48 hours. We may take
              action including content removal, user suspension, or permanent
              ban.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              8. Disclaimers & Liability
            </h2>
            <p>
              <strong>As-Is Service:</strong> The Service is provided
              &quot;as-is&quot; and &quot;as-available&quot; without warranties
              of any kind, express or implied.
            </p>
            <p>
              <strong>No Endorsement:</strong> We do not endorse or assume
              responsibility for user-generated activities, events, or comments.
              Users attend activities at their own risk.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> What&apos;sOnTbilisi
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from use of the Service, including
              lost profits, lost data, or business interruption.
            </p>
            <p>
              <strong>No Medical/Legal Advice:</strong> Nothing on the Service
              should be construed as medical, legal, or professional advice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              9. Third-Party Links & Services
            </h2>
            <p>
              The Service may contain links to third-party websites. We are not
              responsible for the content, accuracy, or practices of external
              sites. Access them at your own risk. We do not endorse any
              third-party services, products, or opinions.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for violating this agreement or
              engaging in conduct we deem inappropriate. Reasons include but are
              not limited to:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Posting prohibited content multiple times</li>
              <li>Harassment or abuse of other users or staff</li>
              <li>Attempting to disrupt the Service</li>
              <li>Fraud or illegal activity</li>
            </ul>
            <p className="mt-2">
              Upon termination, your account and associated data will be marked
              for deletion (see Privacy Policy for retention details).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              11. Modifications to Service
            </h2>
            <p>
              What&apos;sOnTbilisi may modify or discontinue the Service or any
              features at any time, with or without notice. We are not liable
              for any interruptions or changes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes
              will be effective upon posting. Your continued use of the Service
              following changes constitutes your acceptance of the updated
              terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">13. Governing Law</h2>
            <p>
              This agreement is governed by the laws of Georgia, without regard
              to its conflict of law provisions. Any disputes shall be resolved
              through good-faith negotiation or arbitration under Georgian law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">14. Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, contact us at:
            </p>
            <div className="mt-4 rounded border border-muted bg-muted/50 p-4">
              <p>
                <strong>Email:</strong>
                <code className="mx-1 rounded bg-background px-2 py-1">
                  support@whatson-tbilisi.com
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
