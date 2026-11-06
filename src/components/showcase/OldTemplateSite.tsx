/**
 * The same dental practice on a dated off-the-shelf blog theme: boxed layout, gradient banner,
 * tab nav, sidebar widgets, Times and Verdana, blue underlined links. Drawn at phone width (390px),
 * or `wide` at desktop width (1280px) as the classic fixed 960px box with a right-hand sidebar.
 */
export function OldTemplateSite({ wide = false }: { wide?: boolean }) {
  const link = { color: '#0645ad', textDecoration: 'underline' } as const;
  const box = { background: '#fff', border: '1px solid #b9b9b9' } as const;
  return (
    <div
      style={{ background: '#d6d6d6', color: '#333', fontFamily: 'Verdana, Geneva, sans-serif', fontSize: wide ? 13 : 12 }}
      className={wide ? 'px-4 py-5' : 'p-2'}
    >
      <div style={{ ...box, boxShadow: '0 0 6px rgba(0,0,0,0.35)' }} className={wide ? 'mx-auto w-[960px]' : ''}>
        {/* Header */}
        <div
          style={{ background: 'linear-gradient(#3b6fb6, #1d4a8c)', borderBottom: '3px solid #f0c33c' }}
          className={`text-white ${wide ? 'px-5 py-7' : 'px-3 py-4'}`}
        >
          <div
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: wide ? 38 : 26,
              fontWeight: 'bold',
              textShadow: '1px 1px 0 #000',
            }}
          >
            Lumen Dental Clinic
          </div>
          <div style={{ fontSize: 11, fontStyle: 'italic', opacity: 0.9 }}>Just another dental website</div>
        </div>

        {/* Tab nav */}
        <div
          style={{ background: 'linear-gradient(#f4f4f4, #c9c9c9)', borderBottom: '1px solid #999' }}
          className="flex flex-wrap"
        >
          {['Home', 'About Us', 'Services', 'Gallery', 'Contact Us'].map((t, i) => (
            <span
              key={t}
              style={{
                borderRight: '1px solid #999',
                fontWeight: 'bold',
                fontSize: 11,
                background: i === 0 ? '#fff' : undefined,
                color: i === 0 ? '#1d4a8c' : '#444',
              }}
              className="px-2 py-1.5"
            >
              {t}
            </span>
          ))}
        </div>

        <div className={wide ? 'grid grid-cols-[1fr_250px] gap-3 p-3' : 'p-2.5'}>
          <div>
            {/* Marquee-era notice */}
            <div style={{ background: '#ffffcc', border: '1px dashed #e0b000', fontSize: 11 }} className="mb-2.5 px-2 py-1.5">
              <b style={{ color: '#c00' }}>NEW!!</b> We are now accepting new patients. Please call during office hours.
            </div>

            {/* Post */}
            <div style={box} className="mb-2.5 p-2.5">
              <div style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: 20, color: '#1d4a8c', fontWeight: 'bold' }}>
                Welcome to our website!
              </div>
              <div style={{ fontSize: 10, color: '#888', borderBottom: '1px dotted #bbb' }} className="mb-2 pb-1">
                Posted on March 14, 2013 by admin · <span style={link}>3 Comments</span>
              </div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #9fb8c9, #dbe6ec)',
                  border: '4px solid #eee',
                  outline: '1px solid #bbb',
                }}
                className={`mb-2 flex items-center justify-center ${wide ? 'h-[220px]' : 'h-[120px]'}`}
              >
                <span style={{ fontSize: 10, color: '#556' }}>[ dental-chair-stock-photo.jpg ]</span>
              </div>
              <p style={{ lineHeight: 1.5 }}>
                Lumen Dental Clinic offers a wide range of dental services for the whole family. Our friendly staff are here to
                help. For appointments please <span style={link}>click here</span> to download our booking form and fax it back to
                us.
              </p>
              <div style={{ fontSize: 11 }} className="mt-2">
                <span style={link}>Read more »</span>
              </div>
            </div>

            {/* Booking form, the long way */}
            <div style={box} className="mb-2.5 p-2.5">
              <div
                style={{ background: '#e8e8e8', borderBottom: '1px solid #bbb', fontWeight: 'bold', fontSize: 11 }}
                className="-m-2.5 mb-2 px-2.5 py-1.5"
              >
                Request an Appointment
              </div>
              {['Name *', 'Email *', 'Phone *', 'Date of birth *', 'Preferred date *', 'Message *'].map((f) => (
                <div key={f} className="mb-1.5">
                  <div style={{ fontSize: 11 }}>{f}</div>
                  <div
                    style={{
                      border: '1px solid #999',
                      background: '#fafafa',
                      height: f === 'Message *' ? 44 : 18,
                      boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.15)',
                    }}
                  />
                </div>
              ))}
              <span
                style={{ background: 'linear-gradient(#fafafa, #d4d4d4)', border: '1px solid #888', fontSize: 11 }}
                className="mt-1 inline-block px-3 py-0.5"
              >
                Submit
              </span>
            </div>
          </div>

          {/* Sidebar widgets: beside the content on desktop, stacked under it on mobile */}
          <div>
            {[
              { title: 'Search', body: null },
              { title: 'Categories', body: ['Uncategorized (12)', 'News (3)', 'Services (5)'] },
              { title: 'Archives', body: ['March 2013', 'February 2013', 'January 2013'] },
            ].map((w) => (
              <div key={w.title} style={box} className="mb-2.5">
                <div
                  style={{ background: 'linear-gradient(#5a87c5, #2d5a9b)', color: '#fff', fontWeight: 'bold', fontSize: 11 }}
                  className="px-2 py-1"
                >
                  {w.title}
                </div>
                <div className="p-2">
                  {w.body ? (
                    w.body.map((b) => (
                      <div key={b} style={{ fontSize: 11 }} className="mb-0.5">
                        » <span style={link}>{b}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-1">
                      <div style={{ border: '1px solid #999', height: 18 }} className="flex-1" />
                      <span style={{ border: '1px solid #888', background: '#eee', fontSize: 10 }} className="px-1.5">
                        Search
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Visitor counter */}
            <div style={{ ...box, fontSize: 10 }} className="mb-2.5 p-2 text-center">
              You are visitor number{' '}
              <span style={{ background: '#000', color: '#3f3', fontFamily: 'monospace', letterSpacing: 2 }} className="px-1">
                004821
              </span>
            </div>
          </div>
        </div>

        <div style={{ background: '#333', color: '#bbb', fontSize: 10 }} className="px-2.5 py-2 text-center">
          © 2013 Lumen Dental Clinic · All Rights Reserved · Best viewed in Internet Explorer
        </div>
      </div>
    </div>
  );
}
