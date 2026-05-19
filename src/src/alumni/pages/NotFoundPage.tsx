import Link from 'next/link'

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>

          <div className="not-found-actions">
            <Link href="/dashboard" className="primary-btn">
              Back to Dashboard
            </Link>
            <Link href="/requests" className="secondary-btn">
              View My Requests
            </Link>
          </div>

          <div className="not-found-suggestions">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link href="/card-application">Apply for Alumni Card</Link>
              </li>
              <li>
                <Link href="/document-request">Request Documents</Link>
              </li>
              <li>
                <Link href="/clearance-tracker">Check Clearance Status</Link>
              </li>
              <li>
                <Link href="/payments">View Payments</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
