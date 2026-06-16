'use client'

import Image from 'next/image'

export default function QuadPrivacyPolicy() {
  return (
    <>
      <main className="doc">
        <header className="doc-header">
          <div className="brand">
            <Image src="/images/quad-icon.png" alt="Quad icon" width={44} height={44} />
            <span>Quad</span>
          </div>
          <h1>Privacy Policy</h1>
          <p className="dates">
            <strong>Effective Date:</strong> June 16, 2026 &nbsp;|&nbsp;{' '}
            <strong>Last Updated:</strong> June 16, 2026
          </p>
        </header>

        <section className="intro">
          <p>
            Quad Software, LLC, a North Carolina limited liability company (&ldquo;Quad,&rdquo; &ldquo;we,&rdquo;
            &ldquo;our,&rdquo; or &ldquo;us&rdquo;), operates the Quad Connect mobile application (the &ldquo;App&rdquo;).
            This Privacy Policy explains how we collect, use, store, disclose, and protect your personal information when
            you use the App. It also describes your rights and choices regarding that information.
          </p>
          <p>
            By creating an account or using the App, you agree to the collection and use of your information as described
            in this Policy. If you do not agree, please do not use the App.
          </p>
        </section>

        <section>
          <h2>1. Who We Are and How to Reach Us</h2>
          <p>
            <strong>Data Controller:</strong> Quad Software, LLC
            <br />
            <strong>Mailing Address:</strong> 10348 Campus Box, Elon, NC 27244
            <br />
            <strong>Contact Email:</strong>
          </p>
          <p>
            For all privacy-related requests, write to us at{' '}
            <a href="mailto:mastrangelo.tyler@gmail.com">mastrangelo.tyler@gmail.com</a> or{' '}
            <a href="mailto:tmastrangelo@elon.edu">tmastrangelo@elon.edu</a>. We will respond within five (5) business
            days.
          </p>
          <p>
            Quad Connect is an independent application operated by Quad Software, LLC. It is not officially affiliated
            with, sponsored by, or endorsed by Elon University. The App is designed to serve the Elon University
            community but is owned and operated independently.
          </p>
        </section>

        <section>
          <h2>2. Who This Policy Applies To</h2>
          <p>
            The App is intended exclusively for individuals affiliated with Elon University. Account registration
            requires a valid @elon.edu email address. By registering, you represent that you are a current student,
            faculty member, or staff member of Elon University.
          </p>
          <blockquote>
            <strong>Age Representation:</strong> The App is intended for users who are at least 18 years of age, or who
            are at least 13 years of age and have obtained verifiable parental or guardian consent as required by
            applicable law (including the Children&apos;s Online Privacy Protection Act, &ldquo;COPPA&rdquo;). If you are
            under 13, you may not use the App. If we learn that we have collected personal information from a child under
            13 without verifiable parental consent, we will delete it promptly. Parents or guardians who believe their
            child has provided personal information to us should contact us immediately at the addresses above.
          </blockquote>
        </section>

        <section>
          <h2>3. Information We Collect</h2>

          <h3>3.1 Information You Provide to Us</h3>
          <p>When you create an account, you provide:</p>
          <ul>
            <li>First and last name (combined into a display name)</li>
            <li>Email address (must be an @elon.edu address)</li>
            <li>Password (stored only in hashed/salted form by our authentication provider; never in plaintext)</li>
            <li>Profile photo or avatar (optional; user-uploaded image)</li>
          </ul>
          <p>When you use social and community features, you provide:</p>
          <ul>
            <li>Posts you publish (images and captions) to club feeds</li>
            <li>Comments you write on posts</li>
            <li>Likes on posts</li>
            <li>
              Feedback messages, category selections, and any images you attach when submitting in-app feedback or
              support requests
            </li>
          </ul>
          <p>When you or club administrators manage club information, you may provide:</p>
          <ul>
            <li>
              Club names, descriptions, summaries, categories, contact emails, meeting times, websites, and social media
              links
            </li>
            <li>
              Event details (title, description, date/time, location, venue coordinates, host, images, recurrence
              settings)
            </li>
            <li>Club registration submissions</li>
          </ul>

          <h3>3.2 Information Generated by Your Use of the App</h3>
          <p>As you interact with the App, we collect:</p>
          <ul>
            <li>RSVPs to events</li>
            <li>Saved events</li>
            <li>Club memberships, follows, and join requests (including request status)</li>
            <li>Club administrator role assignments</li>
            <li>Per-club notification mute preferences and daily reminder settings</li>
            <li>
              A stored history of in-app notifications you have received (event reminders, admin broadcasts, and club
              updates)
            </li>
            <li>A flag indicating whether you have seen the welcome screen</li>
          </ul>

          <h3>3.3 Automatic and Device Data</h3>
          <ul>
            <li>
              <strong>Push notification token:</strong> When you grant notification permission, your device generates an
              Expo push token that we store to deliver push notifications to your device. This token is stored
              server-side and is never exposed to other users.
            </li>
            <li>
              <strong>Device type indicator:</strong> We check whether you are using a physical device (not an emulator)
              to determine whether to attempt push notification registration. We do not collect device identifiers,
              IMEI, or advertising IDs.
            </li>
            <li>
              <strong>Session data:</strong> Your authentication session (access token and refresh token) is stored in
              your device&apos;s secure keychain or keystore and is not stored in plaintext.
            </li>
            <li>
              <strong>Local app preferences:</strong> Theme color and a testing mode flag are stored locally on your
              device and are not transmitted to our servers.
            </li>
            <li>
              <strong>Crash and error data (if enabled):</strong> If Sentry crash reporting is active in the deployed
              version of the App, anonymized crash logs, exception data, device/OS diagnostic context, and Sentry
              session data may be collected. Performance tracing is disabled. We will update this Policy if Sentry is
              activated or deactivated in production.
            </li>
          </ul>

          <h3>3.4 Location Data</h3>
          <p>We do not collect, store, or transmit your GPS location or any precise geolocation data.</p>
          <p>
            The campus map screen may display your location on a map using your device&apos;s built-in location service
            (the &ldquo;show my location&rdquo; feature). This display is processed entirely on your device by the
            operating system and is not read by the App, sent to our servers, or stored by us. You may receive an
            OS-level location permission prompt when viewing the map. You can deny this permission without affecting any
            other App features.
          </p>
          <p>
            Coordinates stored in our database relate to campus building and event venue locations, not to any
            individual user&apos;s location.
          </p>

          <h3>3.5 Information We Do Not Collect</h3>
          <p>
            We do not collect graduation year, major, phone number, or biographical information. Despite language in a
            prior version of this Policy, graduation year is not requested or stored. We do not collect payment
            information. We do not collect audio or record microphone input.
          </p>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <p>We use your personal information for the following purposes:</p>
          <ul>
            <li>
              <strong>Providing and operating the App:</strong> creating and managing your account, authenticating your
              identity, and enabling all core features (event discovery, RSVPs, club follows, social posts,
              notifications).
            </li>
            <li>
              <strong>Personalized recommendations:</strong> generating event suggestions using an on-device scoring
              algorithm that considers the clubs you follow, your past RSVPs and saves, event categories, and venue
              locations you have engaged with. This processing occurs on your device using data already associated with
              your account. No data is sent to a third-party recommendation or advertising service for this purpose.
            </li>
            <li>
              <strong>Push and in-app notifications:</strong> sending event reminders (one day and one hour before events
              you saved or RSVP&apos;d to), club updates, new post alerts, and administrator broadcast messages.
            </li>
            <li>
              <strong>Club administration:</strong> enabling club administrators to create events and posts, review join
              requests, and view RSVP lists for their clubs.
            </li>
            <li>
              <strong>Support and feedback:</strong> receiving and responding to your in-app feedback or support
              requests.
            </li>
            <li>
              <strong>Security and integrity:</strong> detecting fraud, enforcing our Terms of Service, and maintaining
              platform safety.
            </li>
            <li>
              <strong>Legal compliance:</strong> complying with applicable laws, regulations, and lawful requests.
            </li>
            <li>
              <strong>Service improvement:</strong> diagnosing technical issues, monitoring App performance, and
              improving functionality.
            </li>
          </ul>
          <p>
            We do not use your personal information to serve you advertising. We do not use your data for automated
            individual decision-making that produces legal or similarly significant effects.
          </p>
        </section>

        <section>
          <h2>5. How We Share Your Information</h2>

          <h3>5.1 Within the App</h3>
          <ul>
            <li>
              Your display name and avatar are visible to other users in social contexts, such as on posts and comments
              you author and in RSVP lists viewed by club administrators.
            </li>
            <li>Posts, captions, comments, and likes are visible to other users with access to the relevant club feed.</li>
            <li>RSVP lists for an event are visible to the administrator(s) of the club hosting that event.</li>
            <li>
              Your email address and push notification token are never exposed to other regular users. Database-level
              security policies restrict access; push tokens are resolved only server-side when delivering
              notifications.
            </li>
          </ul>

          <h3>5.2 Service Providers (Sub-Processors)</h3>
          <p>
            We share your personal information with the following third-party service providers solely to operate the
            App. Each provider is contractually obligated to protect your data and to use it only for the services they
            provide to us:
          </p>
          <ul>
            <li>
              <strong>Supabase (supabase.com):</strong> Primary database, authentication, file storage, and serverless
              functions. Data processed: Account credentials, profile data, all user-generated content, engagement data
              (RSVPs, saves, memberships), push notification tokens, and uploaded images.
            </li>
            <li>
              <strong>Expo / Expo Application Services (expo.dev):</strong> Application build, distribution, and push
              notification relay service. Data processed: Device push tokens and the content of push notifications
              (titles, bodies, and snippets such as event names and club names).
            </li>
            <li>
              <strong>Apple Push Notification Service (APNs) and Google Firebase Cloud Messaging (FCM):</strong>{' '}
              Operating system-level push notification transport. Data processed: Push token and notification payload for
              delivery to your device.
            </li>
            <li>
              <strong>Resend (resend.com):</strong> Transactional email delivery. Data processed: Feedback message text,
              category, your user ID and email address, timestamp, and any image attachments you include in a feedback
              submission.
            </li>
            <li>
              <strong>Sentry (sentry.io) (if enabled in production):</strong> Crash and error reporting. Data processed:
              Crash and exception data, device and OS diagnostic context, and session data. Performance tracing is
              disabled.
            </li>
            <li>
              <strong>Apple App Store and Google Play Store:</strong> App distribution. Data processed: Standard
              store-level data associated with app downloads (governed by Apple&apos;s and Google&apos;s own privacy
              policies).
            </li>
          </ul>

          <h3>5.3 No Sale; No Advertising</h3>
          <p>
            We do not sell, rent, or lease your personal information to any third party. We do not share your personal
            information with advertising networks, data brokers, or analytics providers. The App contains no advertising
            SDKs, tracking pixels, or behavioral analytics tools.
          </p>

          <h3>5.4 Administrative Disclosures</h3>
          <p>
            Certain accounts hold elevated access privileges. Club administrators can view the names and avatars of
            members and RSVP&apos;d attendees for their clubs. A designated owner account and an approved list of senders
            can send broadcast notifications to all users. These capabilities are used only to operate the App.
          </p>

          <h3>5.5 Legal and Safety Disclosures</h3>
          <p>
            We may disclose your personal information if we believe in good faith that disclosure is necessary to: (a)
            comply with applicable law or respond to a valid legal process (such as a court order or subpoena); (b)
            protect the rights, property, or safety of Quad Software, LLC, our users, or the public; or (c) detect,
            prevent, or address fraud, security, or technical issues.
          </p>

          <h3>5.6 Business Transfers</h3>
          <p>
            If Quad Software, LLC undergoes a merger, acquisition, reorganization, or sale of assets, your personal
            information may be transferred to the successor entity. We will notify you of any such transfer and any
            choices you may have via a prominent notice in the App or by email.
          </p>
        </section>

        <section>
          <h2>6. User-Generated Content and Public Storage</h2>
          <blockquote>
            <strong>Important:</strong> Images you upload to the App (including your profile avatar, post images, and
            event or club images) are stored in publicly accessible cloud storage buckets. This means that anyone who
            obtains the direct URL to an image can view it, regardless of whether they have an account. Do not upload
            images you wish to keep private.
          </blockquote>
          <p>
            Text you post (captions, comments) is visible to other users who can view the relevant club or feed within
            the App.
          </p>
          <p>
            You are responsible for the content you submit. Do not post personal information about others without their
            consent.
          </p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide the
            App&apos;s services. When you delete your account (see Section 9), we initiate a cascade deletion of your
            profile, RSVPs, saved events, posts, comments, likes, club memberships, join requests, notification records,
            and notification preferences. Your uploaded avatar image is also deleted on a best-effort basis.
          </p>
          <p>Residual copies may persist for a limited period in:</p>
          <ul>
            <li>Supabase database backups, which are retained for a period governed by Supabase&apos;s backup retention schedule;</li>
            <li>
              Resend email delivery logs, which may retain copies of feedback submissions for a period governed by
              Resend&apos;s data retention policies; and
            </li>
            <li>
              Sentry (if enabled), which may retain error/crash records for a period governed by Sentry&apos;s data
              retention policies.
            </li>
          </ul>
          <p>
            We do not maintain automated time-based purge schedules beyond what is described above. Data associated with
            deleted accounts will not be used for any operational purpose after deletion is processed.
          </p>
          <p>If you have a specific retention or deletion question, contact us at the addresses in Section 1.</p>
        </section>

        <section>
          <h2>8. Cookies, Tracking, and Analytics</h2>
          <p>
            The App does not use cookies, advertising identifiers, cross-site tracking, behavioral analytics SDKs (such
            as Google Analytics, Firebase Analytics, Amplitude, Mixpanel, Segment, or Meta Pixel), or any third-party
            tracking technologies.
          </p>
          <p>Session tokens are stored locally on your device in a secure keychain or keystore, not in cookies.</p>
        </section>

        <section>
          <h2>9. Your Choices and Rights</h2>

          <h3>9.1 Profile and Account Controls</h3>
          <ul>
            <li>You may update your display name and avatar at any time from the profile settings screen.</li>
            <li>
              You may delete your account directly within the App at any time. Account deletion permanently removes your
              profile and associated data as described in Section 7. Deletion is irreversible.
            </li>
          </ul>

          <h3>9.2 Notification Controls</h3>
          <ul>
            <li>You may grant or deny push notification permission at the operating-system level at any time.</li>
            <li>Within the App, you may mute notifications for individual clubs.</li>
            <li>You may toggle the daily event-reminder preference in the App settings.</li>
          </ul>

          <h3>9.3 Calendar Integration</h3>
          <p>
            The App may request permission to add events to your device&apos;s native calendar. This is a one-way write;
            we do not read or access any existing entries in your calendar. You may deny or revoke this permission at the
            operating-system level at any time.
          </p>

          <h3>9.4 Photo Library and Camera</h3>
          <p>
            The App requests access to your photo library and camera only to let you select or capture images for posts,
            events, club pages, avatars, and feedback attachments. You may deny or revoke these permissions at the
            operating-system level. Doing so will prevent image uploads but will not affect other App features.
          </p>

          <h3>9.5 Access, Correction, and Deletion Requests</h3>
          <p>
            You may request access to, correction of, or deletion of your personal information by contacting us at the
            email addresses in Section 1. We will respond within five (5) business days. We may need to verify your
            identity before fulfilling a request. In-app account deletion (described in Section 9.1) is the fastest way
            to delete your data.
          </p>

          <h3>9.6 California Residents</h3>
          <p>
            If you are a California resident, you may have additional rights under the California Consumer Privacy Act
            (CCPA) and the California Privacy Rights Act (CPRA), including the right to know what personal information we
            collect and how it is used, the right to delete your personal information, the right to correct inaccurate
            personal information, and the right to opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
            information. We do not sell or share personal information as those terms are defined under California law. To
            exercise any of these rights, contact us at the addresses in Section 1. We will not discriminate against you
            for exercising your privacy rights.
          </p>

          <h3>9.7 Other U.S. State Privacy Laws</h3>
          <p>
            Users in Virginia, Colorado, Connecticut, Texas, and other states with comprehensive privacy laws may have
            rights similar to those described above, including rights to access, correct, delete, and obtain a portable
            copy of your personal information, and the right to opt out of certain processing. To the extent applicable,
            you may exercise these rights by contacting us at the addresses in Section 1.
          </p>

          <h3>9.8 International Users</h3>
          <p>
            The App is designed for and targeted at Elon University affiliates in the United States. We do not knowingly
            market to or target individuals outside the United States. If you access the App from outside the United
            States, your information will be transferred to, processed, and stored in the United States, where data
            protection laws may differ from those in your jurisdiction. By using the App, you consent to this transfer
            and processing.
          </p>
        </section>

        <section>
          <h2>10. Security</h2>
          <p>
            We implement reasonable and appropriate technical and organizational security measures designed to protect
            your personal information against unauthorized access, disclosure, alteration, and destruction. These
            measures include:
          </p>
          <ul>
            <li>Encryption in transit (HTTPS/TLS) for all data transmitted between your device and our servers.</li>
            <li>
              Session tokens stored in your device&apos;s secure enclave or keystore (not in plaintext or unencrypted
              storage).
            </li>
            <li>
              Database-level Row-Level Security (RLS) policies that restrict what data each authenticated user can read
              or write.
            </li>
            <li>Column-level restrictions preventing client-side reads of push notification tokens.</li>
            <li>
              Server-side privilege separation: sensitive operations (account deletion, push notification dispatch,
              administrative broadcasts) execute in isolated serverless functions using service-level credentials; the
              calling user&apos;s identity is always verified from their authentication token.
            </li>
            <li>Passwords managed and stored in hashed and salted form by our authentication provider.</li>
            <li>Explicit blocking of microphone/audio recording permissions.</li>
          </ul>
          <p>
            Despite these measures, no system is completely secure. We cannot guarantee the absolute security of your
            information, and we encourage you to use a strong, unique password and to keep your device software up to
            date.
          </p>
        </section>

        <section>
          <h2>11. Device Permissions Summary</h2>
          <p>The App may request the following device-level permissions:</p>
          <ul>
            <li>
              <strong>Photo Library:</strong> to let you select images for posts, events, club pages, profile avatars,
              and feedback attachments.
            </li>
            <li>
              <strong>Camera:</strong> to let you take photos for posts, events, and other content.
            </li>
            <li>
              <strong>Calendar:</strong> to write event details you choose to your device&apos;s native calendar. The App
              does not read your calendar.
            </li>
            <li>
              <strong>Push Notifications:</strong> to deliver event reminders, club updates, and broadcast messages.
            </li>
            <li>
              <strong>Location (map display only):</strong> to display your position on the campus map. Your location is
              processed on your device and is not transmitted to us.
            </li>
          </ul>
          <p>You may manage all permissions at any time through your device&apos;s operating system settings.</p>
        </section>

        <section>
          <h2>12. Children&apos;s Privacy</h2>
          <p>
            The App is not directed to children under the age of 13. We do not knowingly collect personal information
            from children under 13. If you are a parent or guardian and believe your child has provided personal
            information to us, please contact us immediately at the addresses in Section 1 and we will take steps to
            delete the information and terminate the child&apos;s account.
          </p>
          <p>
            If you are between 13 and 17 years of age, you may use the App only with the consent of a parent or legal
            guardian.
          </p>
        </section>

        <section>
          <h2>13. Third-Party Links and Services</h2>
          <p>
            The App may display links to club websites and social media profiles (e.g., Instagram, Twitter/X, Facebook,
            YouTube). These links direct you to third-party services that have their own privacy policies. We are not
            responsible for the privacy practices of those services, and this Policy does not apply to them. We encourage
            you to review the privacy policies of any third-party services you visit.
          </p>
        </section>

        <section>
          <h2>14. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you by
            posting a prominent notice within the App and by updating the &ldquo;Last Updated&rdquo; date at the top of
            this Policy. For significant changes that materially affect how we handle your personal information, we will
            provide at least thirty (30) days&apos; advance notice before the changes take effect. Your continued use of
            the App after the effective date of any revised Policy constitutes your acceptance of the updated terms.
          </p>
          <p>We encourage you to review this Policy periodically.</p>
        </section>

        <section>
          <h2>15. Contact Us</h2>
          <p>
            If you have questions, concerns, or requests relating to this Privacy Policy or our privacy practices, please
            contact us:
          </p>
          <p>
            <strong>Quad Software, LLC</strong>
            <br />
            10348 Campus Box
            <br />
            Elon, NC 27244
            <br />
            <a href="mailto:mastrangelo.tyler@gmail.com">mastrangelo.tyler@gmail.com</a>
            <br />
            <a href="mailto:tmastrangelo@elon.edu">tmastrangelo@elon.edu</a>
          </p>
          <p>We will respond to all privacy-related inquiries within five (5) business days.</p>
        </section>

        <footer className="doc-footer">
          © 2026 Quad Software, LLC. All rights reserved. Quad Connect and the Quad Connect mark are pending federal
          trademark registration (USPTO Serial No. 99673569).
        </footer>
      </main>

      <style jsx>{`
        .doc {
          max-width: 760px;
          margin: 0 auto;
          padding: clamp(2rem, 6vw, 4rem) clamp(1.25rem, 5vw, 2.5rem) 4rem;
          color: #1f2937;
          line-height: 1.7;
          font-size: 1rem;
        }
        .doc-header {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1.75rem;
          margin-bottom: 2.25rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6a041b;
          margin-bottom: 1.25rem;
        }
        .brand :global(img) {
          border-radius: 12px;
        }
        h1 {
          font-size: clamp(1.9rem, 5vw, 2.4rem);
          margin: 0 0 0.5rem;
          color: #111827;
          font-weight: 700;
        }
        .dates {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .intro p:first-child {
          margin-top: 0;
        }
        section {
          margin-bottom: 2.25rem;
        }
        h2 {
          font-size: 1.3rem;
          color: #6a041b;
          margin: 0 0 0.85rem;
          font-weight: 700;
          scroll-margin-top: 1rem;
        }
        h3 {
          font-size: 1.05rem;
          color: #111827;
          margin: 1.5rem 0 0.5rem;
          font-weight: 600;
        }
        p {
          margin: 0 0 1rem;
        }
        ul {
          margin: 0 0 1rem;
          padding-left: 1.4rem;
        }
        li {
          margin-bottom: 0.5rem;
        }
        a {
          color: #8b1d41;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        a:hover {
          color: #6a041b;
        }
        blockquote {
          margin: 0 0 1rem;
          padding: 1rem 1.25rem;
          border-left: 4px solid #8b1d41;
          background: #faf3f5;
          border-radius: 0 10px 10px 0;
          color: #3f3338;
          font-style: italic;
        }
        .doc-footer {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
          font-style: italic;
        }
      `}</style>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          color: #1f2937;
          min-height: 100vh;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </>
  )
}
