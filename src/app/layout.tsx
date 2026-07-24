src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}

        {/* Accessibility Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Skip to main content functionality
              document.addEventListener('DOMContentLoaded', function() {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.textContent = 'Skip to main content';
                skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50';
                skipLink.addEventListener('click', function(e) {
                  e.preventDefault();
                  const main = document.querySelector('main');
                  if (main) {
                    main.focus();
                    main.scrollIntoView();
                  }
                });
                document.body.insertBefore(skipLink, document.body.firstChild);
              });
            `,
          }}
        />
      </body>
    </html>
  )
}